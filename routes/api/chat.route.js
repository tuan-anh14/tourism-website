const express = require('express');
const router = express.Router();
const chatController = require('../../controller/api/chat.controller');

// POST /api/chat
router.post('/chat', chatController.handleChatCompletion);

module.exports = router;


