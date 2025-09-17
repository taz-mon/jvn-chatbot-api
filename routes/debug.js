const express = require('express');
const router = express.Router();
const DebugController = require('../controllers/debugController');

// Debug/admin endpoints
router.post('/reset', DebugController.resetChatbot);

module.exports = router;