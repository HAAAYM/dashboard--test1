const functions = require("firebase-functions");
const { logger } = functions;
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

exports.aiGatewayV1 = functions.https.onCall(async (data, context) => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  try {
    logger.info(`AI Gateway V1 - Request received: ${requestId}`, {
      requestId,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : [],
    });

    // Support both:
    // 1) { question, questionType }
    // 2) { data: { question, questionType } }
    const actualData = data?.data || data || {};

    logger.info(`Actual data extracted: ${requestId}`, {
      requestId,
      actualDataType: typeof actualData,
      actualDataKeys: Object.keys(actualData),
    });

    const validationResult = validateInput(actualData);
    if (!validationResult.valid) {
      return createErrorResponse(validationResult.error, requestId, startTime);
    }

    // Temporary dashboard fallback until full Firebase Auth is wired
    const authResult = {
      valid: true,
      userId: context.auth?.uid || "dashboard_dev_user",
      role: context.auth?.token?.role || "admin",
      message: context.auth
        ? "Auth extracted from context (V1)"
        : "No auth context provided - using temporary dashboard fallback",
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

    // Try Gemini first
    let finalAnswer = "";
    let finalSource = "fallback";
    let finalConfidence = 0.0;

    try {
      const geminiAnswer = await generateGeminiResponse({
        question: actualData.question,
        questionType: actualData.questionType,
        aiSettings,
      });

      if (geminiAnswer && geminiAnswer.trim()) {
        finalAnswer = geminiAnswer.trim();
        finalSource = "gemini";
        finalConfidence = Number(aiSettings.confidenceThreshold ?? 0.8);
      } else {
        throw new Error("Gemini returned empty response");
      }
    } catch (geminiError) {
      logger.error(`Gemini failed, using fallback: ${requestId}`, {
        requestId,
        error: geminiError.message,
      });

      const fallbackResponse = generateFallbackResponse(
        actualData.questionType,
        actualData.question
      );

      finalAnswer = fallbackResponse.answer;
      finalSource = "fallback";
      finalConfidence = 0.0;
    }

    // Logging should never break the main response
    try {
      await logUsage({
        requestId,
        userId: authResult.userId,
        userRole: authResult.role,
        questionType: actualData.questionType,
        question: actualData.question,
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        source: finalSource,
        success: true,
        confidence: finalConfidence,
        dataAccessed: [],
        errorMessage: null,
      });
    } catch (logError) {
      logger.error(`Usage logging failed but continuing: ${requestId}`, {
        requestId,
        error: logError.message,
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
    logger.error(`AI Gateway V1 - Error: ${requestId}`, {
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

async function generateGeminiResponse({ question, questionType, aiSettings }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const responseStyle = aiSettings.responseStyle || "professional";
  const maxResponseLength = Number(aiSettings.maxResponseLength || 1000);

  const prompt = `
You are the AI assistant for Edu Mate dashboard.
Answer only within the allowed educational/admin context.

Settings:
- Response style: ${responseStyle}
- Maximum response length: ${maxResponseLength} characters
- Question type: ${questionType}

User question:
${question}

Instructions:
- Be concise and useful
- Stay within university/admin assistant context
- Do not answer blocked or unsafe topics
- Keep the answer under ${maxResponseLength} characters
`;

  const result = await model.generateContent(prompt);
  const text = result?.response?.text?.() || "";

  return String(text).slice(0, maxResponseLength);
}

function generateRequestId() {
  return "req_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
}

function validateInput(data) {
  const required = ["question", "questionType"];

  for (const field of required) {
    if (!data[field]) {
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

  if (!validQuestionTypes.includes(data.questionType)) {
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
  logger.info(`Usage logged: ${logEntry.requestId}`, {
    requestId: logEntry.requestId,
  });
}