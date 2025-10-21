const express = require('express');
const router = express.Router();
const chatController = require('../../controller/api/chat.controller');

// POST /api/chat - Gửi tin nhắn và nhận phản hồi
router.post('/chat', chatController.handleChatCompletion);

// GET /api/chat/history - Lấy lịch sử chat của user
router.get('/chat/history', chatController.getChatHistory);

// GET /api/chat/sessions - Lấy danh sách session của user
router.get('/chat/sessions', chatController.getUserSessions);

// DELETE /api/chat/session - Xóa session
router.delete('/chat/session', chatController.deleteSession);

module.exports = router;


