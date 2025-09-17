const ChatbotState = require('../models/ChatbotState');
const QuestionTracking = require('../models/QuestionTracking');
const JVNPersonalityService = require('../services/jvnPersonality');
const PhilosophyService = require('../services/philosophyService');
const { createSuccessResponse, createErrorResponse } = require('../utils/responses');

class ChatbotController {
  static async getStatus(req, res, next) {
    try {
      const chatbotState = await ChatbotState.findOne();
      const questionTracking = await QuestionTracking.findOne();
      
      const mood = JVNPersonalityService.getMood(chatbotState.current_satisfaction_threshold, chatbotState.is_birthday_mode);
      const successRate = chatbotState.total_interactions > 0 ? 
        Math.round((chatbotState.successful_interactions / chatbotState.total_interactions) * 100) : 0;

      const response = {
        jvn_mood: mood,
        global_token_pool: chatbotState.global_token_pool,
        total_interactions: chatbotState.total_interactions,
        successful_interactions: chatbotState.successful_interactions,
        success_rate_percentage: successRate,
        current_difficulty_level: chatbotState.current_satisfaction_threshold,
        questions_remaining: questionTracking.questions_remaining,
        total_questions_asked: questionTracking.total_questions_ever,
        interactions_until_next_birthday: 1000 - (chatbotState.total_interactions % 1000),
        total_birthdays_celebrated: chatbotState.birthday_count
      };

      if (chatbotState.is_birthday_mode) {
        response.special_event = 'birthday';
        response.birthday_number = chatbotState.birthday_count;
        response.celebration_interactions_left = chatbotState.birthday_interactions_left;
        response.birthday_message = `🎉 It's my ${chatbotState.birthday_count}${chatbotState.birthday_count === 1 ? 'st' : chatbotState.birthday_count === 2 ? 'nd' : chatbotState.birthday_count === 3 ? 'rd' : 'th'} birthday! Ze mathematical universe celebrates! 🎂`;
      }

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(error);
    }
  }

  static async getWisdom(req, res, next) {
    try {
      const chatbotState = await ChatbotState.findOne();
      const mood = JVNPersonalityService.getMood(chatbotState.current_satisfaction_threshold, chatbotState.is_birthday_mode);
      
      const philosophy = await PhilosophyService.getRandomPhilosophy(mood, chatbotState.total_interactions);
      
      if (!philosophy) {
        return res.json(createSuccessResponse({
          jvn_mood: mood,
          message: "Ze philosophical subroutines are temporarily offline. Please try again later!",
          wisdom_available: false
        }));
      }

      const response = {
        jvn_wisdom: philosophy.jvn_wisdom,
        wisdom_category: philosophy.category,
        jvn_mood: mood,
        wisdom_rarity: philosophy.rarity,
        times_shared: philosophy.times_shown,
        philosophical_consultation: true
      };

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatbotController;