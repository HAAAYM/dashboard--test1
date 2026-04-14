const functions = require("firebase-functions");
const { logger } = functions;
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

exports.aiGatewayV1 = functions.https.onCall(async (data, context) => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  try {
    const actualData = data?.data || data || {};

    logger.info(`AI Gateway request: ${requestId}`, {
      requestId,
      dataKeys:
        actualData && typeof actualData === "object" ? Object.keys(actualData) : [],
    });

    const validationResult = validateInput(actualData);
    if (!validationResult.valid) {
      return createErrorResponse(validationResult.error, requestId, startTime);
    }

    const authResult = {
      valid: true,
      userId: context?.auth?.uid || "dashboard_dev_user",
      role: context?.auth?.token?.role || "admin",
    };

    const aiSettingsDoc = await db.collection("ai_settings").doc("global").get();
    if (!aiSettingsDoc.exists) {
      return createErrorResponse("AI settings not found", requestId, startTime);
    }

    const aiSettings = aiSettingsDoc.data() || {};

    if (aiSettings.status === "disabled") {
      return createBlockedResponse("AI is currently disabled", requestId, startTime);
    }

    const topicFilterResult = filterTopics(actualData.question, aiSettings.blockedTopics || []);
    if (!topicFilterResult.allowed) {
      return createBlockedResponse(topicFilterResult.reason, requestId, startTime);
    }

    const rateLimitResult = checkRateLimit(
      authResult.userId,
      authResult.role,
      aiSettings.rateLimits || {}
    );

    if (!rateLimitResult.allowed) {
      return createBlockedResponse("Rate limit exceeded", requestId, startTime);
    }

    let finalAnswer = "";
    let finalSource = "fallback";
    let finalConfidence = 0.0;

    try {
      const geminiAnswer = await generateGeminiResponse({
        question: actualData.question,
        questionType: actualData.questionType,
        aiSettings,
        requestId,
      });

      if (!geminiAnswer || !geminiAnswer.trim()) {
        throw new Error("Gemini returned empty response");
      }

      finalAnswer = geminiAnswer.trim();
      finalSource = "gemini";
      finalConfidence = Number(aiSettings.confidenceThreshold ?? 0.8);
    } catch (geminiError) {
      const geminiMessage =
        geminiError?.message ||
        geminiError?.toString() ||
        "Unknown Gemini error";

      logger.error(`Gemini failed: ${requestId}`, {
        requestId,
        error: geminiMessage,
      });

      const fallbackResponse = generateFallbackResponse(actualData.questionType);
      finalAnswer = `${fallbackResponse.answer}\n\n[Gemini error: ${geminiMessage}]`;
      finalSource = "fallback";
      finalConfidence = 0.0;
    }

    try {
      await logUsage({
        requestId,
        userId: authResult.userId,
        userRole: authResult.role,
        questionType: actualData.questionType,
        questionPreview: String(actualData.question || "").slice(0, 150),
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        source: finalSource,
        success: true,
        confidence: finalConfidence,
      });
    } catch (e) {
      logger.error(`Usage logging failed: ${requestId}`, {
        requestId,
        error: e.message,
      });
    }

    return {
      success: true,
      status: finalSource === "gemini" ? "success" : "fallback",
      answer: finalAnswer,
      confidence: finalConfidence,
      source: finalSource,
      requestId,
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    logger.error(`AI Gateway fatal error: ${requestId}`, {
      requestId,
      error: error.message,
      stack: error.stack,
    });

    return createErrorResponse(
      `Internal server error: ${error.message}`,
      requestId,
      startTime
    );
  }
});

async function generateGeminiResponse({ question, questionType, aiSettings, requestId }) {
  const apiKey = "AIzaSyDmNyM_iG_vllHD66d_BdQu0pc6mgorkPA";

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }


  const responseStyle = String(aiSettings.responseStyle || "professional");
  const maxResponseLength = Number(aiSettings.maxResponseLength || 1000);
  const safeQuestionType = String(questionType || "");
  const safeQuestion = String(question || "").normalize("NFC");

  const prompt = `
You are the AI assistant for Edu Mate dashboard.
Answer only within the allowed educational/admin context.

Settings:
- Response style: ${responseStyle}
- Maximum response length: ${maxResponseLength} characters
- Question type: ${safeQuestionType}

User question:
${safeQuestion}

Instructions:
- Be concise and useful
- Stay within university/admin assistant context
- Keep the answer under ${maxResponseLength} characters.
`.trim();

  const modelCandidates = ["gemini-2.5-flash", "gemini-2.5-pro"];

  let lastError = null;

  for (const modelName of modelCandidates) {
    try {
      logger.info(`Gemini REST attempt: ${requestId}`, {
        requestId,
        modelName,
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const raw = await response.text();

      if (!response.ok) {
        throw new Error(`REST ${response.status}: ${raw}`);
      }

      const json = JSON.parse(raw);
      const text =
        json?.candidates?.[0]?.content?.parts?.map((p) => p?.text || "").join("") || "";

      const finalText = String(text).trim();
      if (finalText) {
        return finalText.slice(0, maxResponseLength);
      }

      lastError = new Error(`Empty response for model ${modelName}`);
    } catch (err) {
      lastError = err;
      logger.error(`Gemini REST failed: ${requestId}`, {
        requestId,
        modelName,
        error: err?.message || String(err),
      });
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

function generateRequestId() {
  return "req_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
}

function validateInput(data) {
  const required = ["question", "questionType"];

  for (const field of required) {
    if (
      !data ||
      typeof data !== "object" ||
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      return {
        valid: false,
        error: `Missing required field: ${field}`,
      };
    }
  }

  const validQuestionTypes = [
    "schedule",
    "department",
    "course",
    "library",
    "announcement",
  ];

  if (!validQuestionTypes.includes(String(data.questionType))) {
    return {
      valid: false,
      error: `Invalid question type: ${data.questionType}`,
    };
  }

  return { valid: true };
}

function filterTopics(question, blockedTopics) {
  const questionLower = String(question || "").toLowerCase();

  for (const blockedTopic of blockedTopics) {
    if (questionLower.includes(String(blockedTopic).toLowerCase())) {
      return {
        allowed: false,
        reason: `Question contains blocked topic: ${blockedTopic}`,
      };
    }
  }

  return { allowed: true };
}

function checkRateLimit(userId, role, rateLimits) {
  const limits = {
    student: rateLimits.student || 10,
    faculty: rateLimits.faculty || 50,
    admin: rateLimits.admin || 100,
  };

  const userLimit = limits[role] || 10;

  return {
    allowed: true,
    limit: userLimit,
    current: 0,
  };
}

function generateFallbackResponse(questionType) {
  const responses = {
    schedule:
      "Library hours are typically 8:00 AM - 10:00 PM on weekdays, 10:00 AM - 6:00 PM on weekends. Study rooms are available 24/7 during finals week.",
    department:
      "Department offices are generally open Monday-Friday 9:00 AM - 5:00 PM. Please check the specific department for exact hours and contact information.",
    course:
      "Course schedules vary by semester. Please check your student portal for current course times and locations. Most courses meet 2-3 times per week.",
    library:
      "The main library is open 24/7 during finals week, 8:00 AM - 10:00 PM during regular semesters. Online resources are always available.",
    announcement:
      "Recent announcements include registration deadlines, exam schedules, and campus events. Please check the official university website for the latest updates.",
  };

  return {
    answer:
      responses[questionType] ||
      "I'm sorry, I can only help with schedule, department, course, library, and announcement questions in this version.",
  };
}

function createBlockedResponse(reason, requestId, startTime) {
  return {
    success: false,
    status: "blocked",
    blockedReason: reason,
    source: "fallback",
    requestId,
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
  };
}

function createErrorResponse(errorMessage, requestId, startTime) {
  return {
    success: false,
    status: "error",
    errorMessage,
    source: "fallback",
    requestId,
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
  };
}

async function logUsage(logEntry) {
  await db.collection("ai_usage_logs").add(logEntry);
}