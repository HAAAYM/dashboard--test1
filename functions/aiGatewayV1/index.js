const { logger } = require("firebase-functions/v2");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

/**
 * AI Gateway V1 - Skeleton Implementation
 * 
 * Purpose: Test basic AI Gateway flow without Gemini integration
 * Features: Auth validation, role checking, AI status, topic filtering, rate limiting, fallback responses
 * 
 * V1 Limitations:
 * - No Gemini API integration
 * - No academic data fetching
 * - Mock responses only
 * - Basic rate limiting (in-memory)
 * 
 * Next Steps (V2): Add Gemini integration
 * Next Steps (V3): Add academic data fetching
 */

exports.aiGatewayV1 = functions.https.onCall(async (data, context) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  try {
    // Log incoming request
    logger.info(`AI Gateway V1 - Request received: ${requestId}`, {
      requestId,
      questionType: data.questionType || 'unknown'
    });

    // === STEP 1: Basic Input Validation ===
    const validationResult = validateInput(data);
    if (!validationResult.valid) {
      return createErrorResponse(validationResult.error, requestId, startTime);
    }

    // === STEP 2: Auth Verification (Mock) ===
    // In V1, we extract auth from context or use mock validation
    const authResult = {
      valid: true,
      userId: context.auth?.uid || data.userId || 'mock_user_v1',
      role: context.auth?.token?.role || data.role || 'student',
      message: "Auth extracted from context or request (V1 mock)"
    };

    if (!authResult.valid) {
      return createErrorResponse("Authentication failed", requestId, startTime);
    }

    // === STEP 3: Read AI Settings ===
    const aiSettingsDoc = await db.collection('ai_settings').doc('global').get();
    if (!aiSettingsDoc.exists) {
      return createErrorResponse("AI settings not found", requestId, startTime);
    }

    const aiSettings = aiSettingsDoc.data();
    logger.info(`AI Settings loaded: ${requestId}`, { 
      status: aiSettings.status,
      enabledTopics: aiSettings.allowedTopics?.length || 0
    });

    // === STEP 4: Check AI Status ===
    if (aiSettings.status === 'disabled') {
      return createBlockedResponse("AI is currently disabled", requestId, startTime);
    }

    // === STEP 5: Topic Filtering ===
    const topicFilterResult = filterTopics(data.question, aiSettings.blockedTopics || []);
    if (!topicFilterResult.allowed) {
      return createBlockedResponse(topicFilterResult.reason, requestId, startTime);
    }

    // === STEP 6: Rate Limiting (Basic - In Memory) ===
    // In V1, basic rate limiting (real implementation in V2)
    const rateLimitResult = checkRateLimit(authResult.userId, authResult.role, aiSettings.rateLimits || {});
    if (!rateLimitResult.allowed) {
      return createBlockedResponse("Rate limit exceeded", requestId, startTime);
    }

    // === STEP 7: Generate Fallback Response ===
    const fallbackResponse = generateFallbackResponse(data.questionType, data.question);
    
    // === STEP 8: Log Usage ===
    await logUsage({
      requestId,
      userId: authResult.userId,
      userRole: authResult.role,
      questionType: data.questionType,
      question: data.question,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      source: 'fallback',
      success: true,
      confidence: 0.0,
      dataAccessed: [], // No data access in V1
      errorMessage: null
    });

    // === STEP 9: Return Fallback Response ===
    return {
      success: true,
      status: 'fallback',
      answer: fallbackResponse.answer,
      confidence: 0.0,
      source: 'fallback',
      requestId: requestId,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      relatedData: null
    };

  } catch (error) {
    logger.error(`AI Gateway V1 - Error: ${requestId}`, { 
      requestId, 
      error: error.message,
      stack: error.stack 
    });
    
    return createErrorResponse(`Internal server error: ${error.message}`, requestId, startTime);
  }
});

// === HELPER FUNCTIONS ===

function generateRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function validateInput(data) {
  const required = ['question', 'questionType']; // Removed userId and role - should come from auth
  
  for (const field of required) {
    if (!data[field]) {
      return {
        valid: false,
        error: `Missing required field: ${field}`
      };
    }
  }

  const validQuestionTypes = ['schedule', 'department', 'course', 'library', 'announcement'];

  if (!validQuestionTypes.includes(data.questionType)) {
    return {
      valid: false,
      error: `Invalid question type: ${data.questionType}`
    };
  }

  return { valid: true };
}

function filterTopics(question, blockedTopics) {
  const questionLower = question.toLowerCase();
  
  for (const blockedTopic of blockedTopics) {
    if (questionLower.includes(blockedTopic.toLowerCase())) {
      return {
        allowed: false,
        reason: `Question contains blocked topic: ${blockedTopic}`
      };
    }
  }

  return { allowed: true };
}

function checkRateLimit(userId, role, rateLimits) {
  // In V1, we use a simple in-memory counter (real implementation in V2)
  const limits = {
    student: rateLimits.student || 10,
    faculty: rateLimits.faculty || 50,
    admin: rateLimits.admin || 100
  };

  const userLimit = limits[role] || 10;
  
  // Mock: always allow in V1 (real check in V2)
  return {
    allowed: true,
    limit: userLimit,
    current: 0 // Mock
  };
}

function generateFallbackResponse(questionType, question) {
  const responses = {
    schedule: "Library hours are typically 8:00 AM - 10:00 PM on weekdays, 10:00 AM - 6:00 PM on weekends. Study rooms are available 24/7 during finals week.",
    department: "Department offices are generally open Monday-Friday 9:00 AM - 5:00 PM. Please check the specific department for exact hours and contact information.",
    course: "Course schedules vary by semester. Please check your student portal for current course times and locations. Most courses meet 2-3 times per week.",
    library: "The main library is open 24/7 during finals week, 8:00 AM - 10:00 PM during regular semesters. Online resources are always available.",
    announcement: "Recent announcements include registration deadlines, exam schedules, and campus events. Please check the official university website for the latest updates."
  };

  return {
    answer: responses[questionType] || "I'm sorry, I can only help with schedule, department, course, library, and announcement questions in this version."
  };
}

function createBlockedResponse(reason, requestId, startTime) {
  return {
    success: false,
    status: 'blocked',
    blockedReason: reason,
    source: 'fallback',
    requestId: requestId,
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime
  };
}

function createErrorResponse(errorMessage, requestId, startTime) {
  return {
    success: false,
    status: 'error',
    errorMessage: errorMessage,
    source: 'fallback',
    requestId: requestId,
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime
  };
}

async function logUsage(logEntry) {
  try {
    await db.collection('ai_usage_logs').add(logEntry);
    logger.info(`Usage logged: ${logEntry.requestId}`, { requestId: logEntry.requestId });
  } catch (error) {
    logger.error(`Failed to log usage: ${logEntry.requestId}`, { 
      requestId: logEntry.requestId,
      error: error.message 
    });
  }
}
