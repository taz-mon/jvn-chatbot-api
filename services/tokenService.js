// Determine for statisfaction based on tokens

const { TOKEN_VALUES, QUESTIONS_PER_TOKEN } = require('../config/constants');

class TokenService {
  static determineSuccess(currentThreshold) {
    const randomValue = Math.random() * 10;
    return randomValue >= currentThreshold;
  }

  static calculateTokensEarned(activityType, level = null) {
    // Extract token calculation logic
    // From server-backup.js food route (lines ~375-377)
  if (activityType.includes('food')) {
    const tokenValues = { snack: 1, entree: 2, restaurant: 5 };
    return tokenValues[level] || 1;
  }
  
  // From server-backup.js birthday-cake route (line ~715)
  if (activityType === 'birthday_cake') {
    return 10;
  }
  
  // All other activities (fresh_air, joke, game, etc.) = 1 token
  return 1;
  }

  static async spendTokenForQuestions(chatbotState, questionTracking) {
    // Extract token spending logic
  // From server-backup.js ask-question route (lines ~777-795)
  if (chatbotState.global_token_pool <= 0) {
    return {
      success: false,
      error: 'No tokens available! Please inspire JVN to earn tokens first.',
      global_token_pool: 0,
      suggestion: 'Try POST /inspire/fresh-air or other inspiration endpoints!'
      };
  }

  if (questionTracking.questions_remaining <= 0) {
    // Use a token (1 token = 5 questions)
    if (chatbotState.global_token_pool <= 0) {
      return {
        success: false,
        error: 'No tokens available for questions!',
        global_token_pool: 0
    };
  }

    chatbotState.global_token_pool -= 1;
    questionTracking.questions_remaining = 5;
  }

  return { success: true };
  }

  static validateTokensAvailable(tokenPool) {
    // Token validation logic
    // From server-backup.js ask-question route (lines ~777-780)
  if (tokenPool <= 0) {
    return {
      valid: false,
      message: 'No tokens available! Please inspire JVN to earn tokens first.'
    };
  }
  
  return { valid: true };
  }
  }

module.exports = TokenService;

