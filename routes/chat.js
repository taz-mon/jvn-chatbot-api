const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

// Chat interaction endpoints
router.post('/ask-question', ChatController.askQuestion);

module.exports = router;