const ChatbotState = require('../models/ChatbotState');
const UserInteraction = require('../models/UserInteraction');
const TokenUsage = require('../models/TokenUsage');
const QuestionTracking = require('../models/QuestionTracking');
const { seedDatabase } = require('../utils/seedData');
const { createSuccessResponse, createErrorResponse } = require('../utils/responses');

class DebugController {
  static async resetChatbot(req, res, next) {
    try {
      // Clear all data
      await ChatbotState.deleteMany({});
      await UserInteraction.deleteMany({});
      await TokenUsage.deleteMany({});
      await QuestionTracking.deleteMany({});
      
      // Reinitialize database
      await seedDatabase();
      
      res.json(createSuccessResponse({
        message: 'JVN has been reset to initial state!',
        status: 'Ze mathematical universe has been reinitialized!'
      }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DebugController;