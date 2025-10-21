// Use Gemini Generative Language API (models: gemini-1.5-flash-latest is good for chat)
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || 'YOUR_KEY_HERE' });
const ChatHistory = require('../../model/ChatHistory');

// Simple in-memory cache for responses
const responseCache = new Map();
const RATE_LIMIT = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_DURATION = 1000; // 1 second

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.trim() }))
    .slice(-20);
}

exports.handleChatCompletion = async (req, res) => {
  try {
    const { messages, user_id, session_id } = req.body || {};
    const history = normalizeMessages(messages);
    
    // Rate limiting
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (RATE_LIMIT.has(clientIP)) {
      const lastRequest = RATE_LIMIT.get(clientIP);
      if (now - lastRequest < RATE_LIMIT_DURATION) {
        return res.json({ 
          role: 'assistant', 
          content: 'Vui lòng chờ một chút trước khi gửi tin nhắn tiếp theo.' 
        });
      }
    }
    RATE_LIMIT.set(clientIP, now);
    
    // Cache check
    const cacheKey = JSON.stringify({ messages: history });
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.response);
      } else {
        responseCache.delete(cacheKey);
      }
    }

    // Convert to Gemini's content format
    const contents = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const systemPreamble = process.env.CHATBOT_SYSTEM_PROMPT || 'Bạn là trợ lý du lịch của website Hà Nội Vibes, trả lời thân thiện, ngắn gọn, có ích.';

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: systemPreamble }] },
        ...contents
      ],
      generationConfig: {
        temperature: 0.6,
        topK: 32,
        topP: 0.9,
        maxOutputTokens: 512
      }
    };
    
    // If no API key, gracefully degrade with local reply (avoid 4xx to client)
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_KEY_HERE') {
      const lastUser = history.findLast ? history.findLast(m => m.role === 'user') : [...history].reverse().find(m => m.role === 'user');
      const fallback = lastUser && lastUser.content
        ? `(Chế độ demo) Bạn hỏi: "${lastUser.content}". Hiện chưa cấu hình khóa AI, vui lòng liên hệ quản trị viên hoặc đặt biến môi trường GEMINI_API_KEY.`
        : '(Chế độ demo) Xin chào! Vui lòng nhập câu hỏi của bạn.';
      return res.json({ role: 'assistant', content: fallback });
    }
    
    // Call Gemini using @google/genai SDK
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: payload.contents
      });
      const text = (response && response.text) || 'Xin lỗi, hiện chưa có phản hồi.';
      const responseData = { role: 'assistant', content: text };
      
      // Cache the response
      responseCache.set(cacheKey, {
        response: responseData,
        timestamp: now
      });
      
      // Lưu lịch sử chat nếu có user_id
      if (user_id && session_id) {
        await saveChatHistory(user_id, session_id, history, responseData);
      }
      
      return res.json(responseData);
    } catch (sdkErr) {
      const friendly = 'Xin lỗi, hệ thống chưa thể trả lời lúc này.';
      return res.json({ role: 'assistant', content: friendly, meta: { source: 'genai-sdk', error: sdkErr && sdkErr.message } });
    }
  } catch (err) {
    // Always degrade gracefully to 200 so client widget doesn't show 4xx/5xx
    res.json({ role: 'assistant', content: 'Xin lỗi, đã xảy ra lỗi máy chủ.', meta: { error: err && err.message } });
  }
};

// Function để lưu lịch sử chat
async function saveChatHistory(user_id, session_id, history, responseData) {
  try {
    // Tìm session hiện tại hoặc tạo mới
    let chatHistory = await ChatHistory.findOne({
      user_id: user_id,
      session_id: session_id,
      is_active: true
    });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user_id: user_id,
        session_id: session_id,
        messages: []
      });
    }

    // Chỉ thêm tin nhắn mới nhất từ history (tránh trùng lặp)
    const lastUserMessage = history[history.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      // Kiểm tra xem tin nhắn này đã được lưu chưa
      const lastSavedMessage = chatHistory.messages[chatHistory.messages.length - 1];
      if (!lastSavedMessage || lastSavedMessage.content !== lastUserMessage.content) {
        chatHistory.messages.push({
          role: lastUserMessage.role,
          content: lastUserMessage.content,
          timestamp: new Date()
        });
      }
    }

    // Thêm phản hồi từ AI
    chatHistory.messages.push({
      role: responseData.role,
      content: responseData.content,
      timestamp: new Date()
    });
    
    // Giới hạn số lượng tin nhắn để tránh quá tải
    if (chatHistory.messages.length > 100) {
      chatHistory.messages = chatHistory.messages.slice(-100);
    }

    await chatHistory.save();
    console.log('✅ Chat history saved successfully');
  } catch (error) {
    console.error('❌ Error saving chat history:', error);
  }
}

// Function để lấy lịch sử chat của user
exports.getChatHistory = async (req, res) => {
  try {
    const { user_id, session_id, limit = 50 } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    let query = { user_id: user_id, is_active: true };
    
    if (session_id) {
      query.session_id = session_id;
    }

    const chatHistories = await ChatHistory.find(query)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .select('session_id messages created_at updated_at');

    res.json({
      success: true,
      data: chatHistories
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function để lấy tất cả session của user
exports.getUserSessions = async (req, res) => {
  try {
    const { user_id, limit = 20 } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const sessions = await ChatHistory.find({ 
      user_id: user_id, 
      is_active: true 
    })
    .sort({ updated_at: -1 })
    .limit(parseInt(limit))
    .select('session_id messages created_at updated_at created_at');

    // Chỉ lấy tin nhắn đầu tiên của mỗi session để preview
    const sessionsWithPreview = sessions.map(session => ({
      session_id: session.session_id,
      created_at: session.created_at,
      updated_at: session.updated_at,
      preview: session.messages.length > 0 ? session.messages[0].content.substring(0, 100) + '...' : '',
      message_count: session.messages.length
    }));

    res.json({
      success: true,
      data: sessionsWithPreview
    });
  } catch (error) {
    console.error('Error getting user sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function để xóa session
exports.deleteSession = async (req, res) => {
  try {
    const { user_id, session_id } = req.body;
    
    if (!user_id || !session_id) {
      return res.status(400).json({ error: 'user_id and session_id are required' });
    }

    await ChatHistory.findOneAndUpdate(
      { user_id: user_id, session_id: session_id },
      { is_active: false, updated_at: new Date() }
    );

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


