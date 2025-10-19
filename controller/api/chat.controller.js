// Use Gemini Generative Language API (models: gemini-1.5-flash-latest is good for chat)
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || 'YOUR_KEY_HERE' });

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
    const { messages } = req.body || {};
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


