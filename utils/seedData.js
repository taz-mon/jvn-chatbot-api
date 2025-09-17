//
const ChatbotState = require('../models/ChatbotState');
const QuestionTracking = require('../models/QuestionTracking');
const Philosophy = require('../models/Philosophy');
const { philosophyEntries } = require('../services/philosophyService');

const seedDatabase = async () => {
  console.log('Initializing database...');
  
  // Initialize ChatbotState if it doesn't exist
  let chatbotState = await ChatbotState.findOne();
  if (!chatbotState) {
    chatbotState = new ChatbotState();
    await chatbotState.save();
    console.log('Created initial chatbot state');
  }

  // Initialize QuestionTracking if it doesn't exist
  let questionTracking = await QuestionTracking.findOne();
  if (!questionTracking) {
    questionTracking = new QuestionTracking();
    await questionTracking.save();
    console.log('Created initial question tracking');
  }

  // Initialize Philosophy entries
  const existingPhilosophy = await Philosophy.countDocuments();
  if (existingPhilosophy === 0) {
    await Philosophy.insertMany(philosophyEntries);
    console.log('Inserted philosophy database entries');
  }

  console.log('Database initialization complete!');
};

module.exports = { seedDatabase };