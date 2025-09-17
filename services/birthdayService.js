// sets up the birthday service
const { BIRTHDAY_TRIGGER_INTERVAL, BIRTHDAY_INTERACTIONS_COUNT } = require('../config/constants');

class BirthdayService {
  static checkAndTriggerBirthday(chatbotState) {
    if (chatbotState.total_interactions > 0 && 
        chatbotState.total_interactions % BIRTHDAY_TRIGGER_INTERVAL === 0 && 
        !chatbotState.is_birthday_mode) {
      
      chatbotState.is_birthday_mode = true;
      chatbotState.birthday_interactions_left = BIRTHDAY_INTERACTIONS_COUNT;
      chatbotState.birthday_count += 1;
      chatbotState.last_birthday = new Date();
      chatbotState.current_satisfaction_threshold = 0;
    }
  }

  static handleBirthdayCountdown(chatbotState) {
    if (chatbotState.is_birthday_mode) {
      chatbotState.birthday_interactions_left -= 1;
      if (chatbotState.birthday_interactions_left <= 0) {
        chatbotState.is_birthday_mode = false;
        chatbotState.current_satisfaction_threshold = 1;
      }
    }
  }
}

module.exports = BirthdayService;