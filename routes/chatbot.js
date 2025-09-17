const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/chatbotController');

// Chatbot status and wisdom endpoints
router.get('/status', ChatbotController.getStatus);
router.get('/wisdom', ChatbotController.getWisdom);

module.exports = router;