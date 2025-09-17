// for the chatbot state schema
const mongoose = require('mongoose');

const chatbotStateSchema = new mongoose.Schema({
  total_interactions: { 
    type: Number, 
    default: 0,
    min: 0
  },
  successful_interactions: { 
    type: Number, 
    default: 0,
    min: 0
  },
  current_satisfaction_threshold: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 10
  },
  global_token_pool: { 
    type: Number, 
    default: 0,
    min: 0
  },
  birthday_count: { 
    type: Number, 
    default: 0,
    min: 0
  },
  last_birthday: { 
    type: Date, 
    default: null 
  },
  is_birthday_mode: { 
    type: Boolean, 
    default: false 
  },
  birthday_interactions_left: { 
    type: Number, 
    default: 0,
    min: 0
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
chatbotStateSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Instance methods
chatbotStateSchema.methods.getSuccessRate = function() {
  if (this.total_interactions === 0) return 0;
  return Math.round((this.successful_interactions / this.total_interactions) * 100);
};

chatbotStateSchema.methods.getInteractionsUntilBirthday = function() {
  return 1000 - (this.total_interactions % 1000);
};

chatbotStateSchema.methods.shouldTriggerBirthday = function() {
  return this.total_interactions > 0 && 
         this.total_interactions % 1000 === 0 && 
         !this.is_birthday_mode;
};

module.exports = mongoose.model('ChatbotState', chatbotStateSchema);

