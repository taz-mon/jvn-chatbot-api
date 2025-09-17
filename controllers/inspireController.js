// this is for the Inspiration Controller
const ChatbotState = require('../models/ChatbotState');
const UserInteraction = require('../models/UserInteraction');
const TokenUsage = require('../models/TokenUsage');
const JVNPersonalityService = require('../services/jvnPersonality');
const TokenService = require('../services/tokenService');
const BirthdayService = require('../services/birthdayService');
const PhilosophyService = require('../services/philosophyService');
const { createSuccessResponse, createErrorResponse } = require('../utils/responses');
const { ACTIVITY_TYPES, TOKEN_VALUES } = require('../config/constants');

class InspireController {
  static async freshAir(req, res, next) {
    try {
      const result = await InspireController._processInspiration(ACTIVITY_TYPES.FRESH_AIR, TOKEN_VALUES.STANDARD);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async food(req, res, next) {
    try {
      const { level } = req.body;
      
      if (!level || !['snack', 'entree', 'restaurant'].includes(level)) {
        return res.status(400).json(createErrorResponse(
          'Ze food level must be: snack (1 token), entree (2 tokens), or restaurant (5 tokens)',
          'INVALID_FOOD_LEVEL'
        ));
      }

      const tokenValue = TOKEN_VALUES.FOOD[level];
      const result = await InspireController._processInspiration(`${ACTIVITY_TYPES.FOOD}_${level}`, tokenValue, { level });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async joke(req, res, next) {
    try {
      const result = await InspireController._processInspiration(ACTIVITY_TYPES.JOKE, TOKEN_VALUES.STANDARD);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async game(req, res, next) {
    try {
      const result = await InspireController._processInspiration(ACTIVITY_TYPES.GAME, TOKEN_VALUES.STANDARD);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async physicalCare(req, res, next) {
    try {
      const result = await InspireController._processInspiration(ACTIVITY_TYPES.PHYSICAL_CARE, TOKEN_VALUES.STANDARD);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async compliment(req, res, next) {
    try {
      const result = await InspireController._processInspiration(ACTIVITY_TYPES.COMPLIMENT, TOKEN_VALUES.STANDARD);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async birthdayCake(req, res, next) {
    try {
      const chatbotState = await ChatbotState.findOne();
      
      if (!chatbotState.is_birthday_mode) {
        const nextBirthdayIn = chatbotState.getInteractionsUntilBirthday();
        return res.status(400).json(createErrorResponse(
          'Birthday kuchen can only be given during birthday celebrations! 🎂',
          'NOT_BIRTHDAY_MODE',
          { 
            message: "Save ze cake for my birthday!",
            next_birthday_in: nextBirthdayIn
          }
        ));
      }

      const result = await InspireController._processBirthdayCake(chatbotState);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Private helper methods
  static async _processInspiration(activityType, potentialTokens, additionalData = {}) {
    const chatbotState = await ChatbotState.findOne();
    
    // Check for birthday trigger
    await BirthdayService.checkAndTriggerBirthday(chatbotState);
    
    // Determine success
    const currentThreshold = chatbotState.is_birthday_mode ? 0 : chatbotState.current_satisfaction_threshold;
    const success = await TokenService.determineSuccess(currentThreshold);
    const tokensEarned = success ? potentialTokens : 0;
    const mood = JVNPersonalityService.getMood(currentThreshold, chatbotState.is_birthday_mode);

    // Update state
    await InspireController._updateChatbotState(chatbotState, success, tokensEarned);
    
    // Log interaction
    await InspireController._logInteraction(activityType, success, tokensEarned, mood, currentThreshold, chatbotState.is_birthday_mode);
    
    // Check for philosophical moment
    const philosophy = JVNPersonalityService.shouldShowPhilosophy(mood, chatbotState.total_interactions) 
      ? await PhilosophyService.getRandomPhilosophy(mood, chatbotState.total_interactions)
      : null;

    // Build response
    const response = createSuccessResponse({
      success,
      tokens_earned: tokensEarned,
      message: JVNPersonalityService.getResponse(activityType, success, mood, tokensEarned, 
                                                 chatbotState.is_birthday_mode ? 'birthday' : null),
      jvn_mood: mood,
      global_token_pool: chatbotState.global_token_pool,
      total_interactions: chatbotState.total_interactions,
      difficulty_level: currentThreshold,
      ...additionalData
    });

    // Add birthday info if applicable
    if (chatbotState.is_birthday_mode) {
      response.data.special_event = 'birthday';
      response.data.birthday_number = chatbotState.birthday_count;
      response.data.celebration_interactions_left = chatbotState.birthday_interactions_left;
    }

    // Add philosophy if triggered
    if (philosophy) {
      response.data.philosophical_moment = true;
      response.data.jvn_wisdom = philosophy.jvn_wisdom;
    }

    return response;
  }

  static async _processBirthdayCake(chatbotState) {
    const tokensEarned = TOKEN_VALUES.BIRTHDAY_CAKE;
    const mood = JVNPersonalityService.getMood(0, true);

    // Update state
    await InspireController._updateChatbotState(chatbotState, true, tokensEarned);
    
    // Log interaction
    await InspireController._logInteraction(ACTIVITY_TYPES.BIRTHDAY_CAKE, true, tokensEarned, mood, 0, true);

    return createSuccessResponse({
      success: true,
      tokens_earned: tokensEarned,
      special_event: "birthday_cake",
      message: "🎂✨ BIRTHDAY KUCHEN! Zis is ze BEST gift ever! Ze mathematical beauty approaches infinity! ✨🎂",
      jvn_mood: mood,
      cake_pieces_eaten: Math.floor(Math.random() * 3) + 1,
      birthday_wish: "I wish for more friends who understand ze beauty of mathematics!",
      global_token_pool: chatbotState.global_token_pool,
      celebration_interactions_left: chatbotState.birthday_interactions_left
    });
  }

  static async _updateChatbotState(chatbotState, success, tokensEarned) {
    chatbotState.total_interactions += 1;
    
    if (success) {
      chatbotState.successful_interactions += 1;
      chatbotState.global_token_pool += tokensEarned;
    }

    // Update threshold
    chatbotState.current_satisfaction_threshold = JVNPersonalityService.calculateNewThreshold(
      chatbotState.total_interactions, 
      chatbotState.is_birthday_mode
    );

    // Handle birthday countdown
    if (chatbotState.is_birthday_mode) {
      chatbotState.birthday_interactions_left -= 1;
      if (chatbotState.birthday_interactions_left <= 0) {
        chatbotState.is_birthday_mode = false;
        chatbotState.current_satisfaction_threshold = 1; // Reset to easy
      }
    }

    await chatbotState.save();
  }

  static async _logInteraction(activityType, success, tokensEarned, mood, threshold, isBirthday) {
    await UserInteraction.create({
      activity_type: activityType,
      success,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: threshold,
      special_event: isBirthday ? 'birthday' : null
    });

    if (success && tokensEarned > 0) {
      await TokenUsage.create({
        action: 'earned',
        amount: tokensEarned,
        activity_type: activityType
      });
    }
  }
}

module.exports = InspireController;
