const ChatbotState = require('../models/ChatbotState');
const QuestionTracking = require('../models/QuestionTracking');
const TokenUsage = require('../models/TokenUsage');
const JVNPersonalityService = require('../services/jvnPersonality');
const PhilosophyService = require('../services/philosophyService');
const TokenService = require('../services/tokenService');
const { createSuccessResponse, createErrorResponse } = require('../utils/responses');

class ChatController {
  static async askQuestion(req, res, next) {
    try {
      const { question } = req.body;
      
      if (!question || question.trim().length === 0) {
        return res.status(400).json(createErrorResponse(
          'Ze question parameter is required for mathematical discourse!',
          'MISSING_QUESTION'
        ));
      }

      const chatbotState = await ChatbotState.findOne();
      const questionTracking = await QuestionTracking.findOne();
      
      // Validate tokens available
      const tokenValidation = TokenService.validateTokensAvailable(chatbotState.global_token_pool);
      if (!tokenValidation.valid) {
        return res.status(400).json(createErrorResponse(
          tokenValidation.message,
          'NO_TOKENS_AVAILABLE',
          { 
            global_token_pool: 0,
            suggestion: 'Try POST /inspire/fresh-air or other inspiration endpoints!'
          }
        ));
      }

      // Spend token if needed
      const spendResult = await TokenService.spendTokenForQuestions(chatbotState, questionTracking);
      if (!spendResult.success) {
        return res.status(400).json(createErrorResponse(
          spendResult.error,
          'TOKEN_SPEND_FAILED',
          { global_token_pool: spendResult.global_token_pool }
        ));
      }

      // Use one question
      questionTracking.questions_remaining -= 1;
      questionTracking.questions_asked += 1;
      questionTracking.total_questions_ever += 1;
      questionTracking.last_token_used = new Date();

      await chatbotState.save();
      await questionTracking.save();

      // Generate JVN's response based on mood
      const mood = JVNPersonalityService.getMood(chatbotState.current_satisfaction_threshold, chatbotState.is_birthday_mode);
      
      const responses = {
        pleased: [
          "Ah, an interesting question! Let me apply my mathematical reasoning...",
          "Wunderbar! Zis requires proper analytical thinking!",
          "Excellent inquiry! Ze logical framework suggests..."
        ],
        analytical: [
          "Ze question demonstrates systematic thinking. I shall compute ze answer...",
          "Acceptable query. Ze algorithmic approach indicates...",
          "Logical inquiry detected. Initiating comprehensive analysis..."
        ],
        slightly_annoyed: [
          "Hmph. At least zis question shows some intellectual merit...",
          "Ze question is adequate, though ze complexity could be improved...",
          "Acceptable, though I expect more sophisticated reasoning next time..."
        ],
        demanding: [
          "Finally! A question worthy of my computational capabilities!",
          "Ze intellectual rigor is marginally acceptable. Ze answer is...",
          "About time someone asked something requiring real mathematical thought!"
        ],
        insufferable: [
          "At last! A question that doesn't insult ze mathematical universe!",
          "Miraculous! Someone capable of formulating a coherent inquiry!",
          "Ze probability of receiving an intelligent question was approaching zero!"
        ],
        ecstatic: [
          "🎂 BIRTHDAY BRILLIANCE! Ze most magnificent question I've heard all year!",
          "🎉 WUNDERBAR! Ze mathematical elegance of zis inquiry is extraordinary!",
          "✨ MAGNIFICENT! Zis question deserves a special birthday answer!"
        ]
      };

      const responseArray = responses[mood] || responses.pleased;
      const jvnResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

      // Check for philosophical moment (10% chance during questions)
      let philosophicalMoment = null;
      if (Math.random() < 0.10) {
        philosophicalMoment = await PhilosophyService.getRandomPhilosophy(mood, chatbotState.total_interactions);
      }

      const response = {
        success: true,
        jvn_response: jvnResponse,
        your_question: question,
        jvn_mood: mood,
        questions_remaining: questionTracking.questions_remaining,
        global_token_pool: chatbotState.global_token_pool,
        total_questions_asked: questionTracking.total_questions_ever
      };

      if (philosophicalMoment) {
        response.bonus_wisdom = true;
        response.jvn_wisdom = philosophicalMoment.jvn_wisdom;
      }

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatController;