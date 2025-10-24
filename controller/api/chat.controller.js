// Use Gemini Generative Language API (models: gemini-1.5-flash-latest is good for chat)
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || 'YOUR_KEY_HERE' });
const ChatHistory = require('../../model/ChatHistory');

// Enhanced caching and rate limiting with load balancing
const responseCache = new Map();
const RATE_LIMIT = new Map();
const REQUEST_QUEUE = new Map(); // Queue for handling concurrent requests
const GLOBAL_QUEUE = []; // Global request queue for load balancing
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (increased)
const RATE_LIMIT_DURATION = 500; // 500ms (reduced from 1s)
const MAX_CONCURRENT_REQUESTS = 5; // Max concurrent requests per IP
const MAX_GLOBAL_CONCURRENT = 20; // Max global concurrent requests
const MAX_RETRIES = 3; // Max retry attempts
const RETRY_DELAY = 1000; // 1 second between retries
const QUEUE_PROCESSING_INTERVAL = 100; // Process queue every 100ms

// Global request counter for load balancing
let globalRequestCount = 0;
let isProcessingQueue = false;

// Enhanced system prompts for better responses
const SYSTEM_PROMPTS = {
  default: `Bạn là ViA - trợ lý du lịch thông minh của website Hà Nội Vibes. 
Bạn chuyên về:
- Tư vấn du lịch Hà Nội (địa điểm, ẩm thực, văn hóa)
- Gợi ý lịch trình du lịch
- Thông tin về phương tiện di chuyển
- Địa điểm check-in nổi tiếng
- Lịch sử và văn hóa Hà Nội

Hãy trả lời ngắn gọn, thân thiện, chính xác và hữu ích. Sử dụng tiếng Việt tự nhiên.`,
  
  travel: `Bạn là chuyên gia du lịch Hà Nội với 10 năm kinh nghiệm. 
Tập trung vào:
- Địa điểm du lịch nổi tiếng (Hồ Gươm, Văn Miếu, Phố cổ...)
- Ẩm thực đặc sản (Phở, Bún chả, Chả cá...)
- Lịch trình tối ưu theo thời gian
- Mẹo du lịch tiết kiệm và an toàn`,
  
  food: `Bạn là food blogger chuyên về ẩm thực Hà Nội.
Chuyên môn:
- Quán ăn ngon, giá hợp lý
- Món ăn đặc sản từng khu vực
- Thời gian mở cửa và địa chỉ chính xác
- Mẹo thưởng thức món ăn đúng cách`
};

// Pre-defined template responses for quick questions
const TEMPLATE_RESPONSES = {
  "Gợi ý lịch trình 2 ngày ở Hà Nội?": `🗓️ **Lịch trình 2 ngày ở Hà Nội:**

**Ngày 1: Khám phá trung tâm**
• **Sáng**: Tham quan Hồ Gươm, Đền Ngọc Sơn, Cầu Thê Húc
• **Trưa**: Ăn phở tại Phở Gia Truyền Bát Đàn
• **Chiều**: Dạo phố cổ, mua sắm tại chợ Đồng Xuân
• **Tối**: Thưởng thức bún chả tại Bún chả Hàng Mành

**Ngày 2: Văn hóa & Lịch sử**
• **Sáng**: Tham quan Văn Miếu - Quốc Tử Giám
• **Trưa**: Ăn chả cá Lã Vọng
• **Chiều**: Tham quan Lăng Chủ tịch Hồ Chí Minh, Chùa Một Cột
• **Tối**: Dạo phố đi bộ Hồ Gươm, thưởng thức kem Tràng Tiền

💡 **Mẹo**: Mua vé tham quan trước, mang theo nước uống và kem chống nắng!`,

  "Ăn gì ngon ở Phố cổ Hà Nội?": `🍜 **Ẩm thực Phố cổ Hà Nội - Top món ngon:**

**Món chính:**
• **Phở Bát Đàn** - Phở bò truyền thống (35-45k)
• **Bún chả Hàng Mành** - Bún chả Obama (40-50k)
• **Chả cá Lã Vọng** - Đặc sản nổi tiếng (150-200k)
• **Bún ốc** - Bún ốc Hàng Điếu (25-35k)

**Đồ uống & Tráng miệng:**
• **Cà phê trứng** - Cà phê Giảng (25-35k)
• **Kem Tràng Tiền** - Kem truyền thống (15-25k)
• **Chè** - Chè bà cốt (10-20k)

**Quán ăn nổi tiếng:**
📍 Phở Gia Truyền Bát Đàn (49 Bát Đàn)
📍 Bún chả Hàng Mành (1 Hàng Mành)
📍 Chả cá Lã Vọng (14 Chả Cá)

⏰ **Thời gian**: Hầu hết quán mở 6h-22h, một số mở 24/7`,

  "Phương tiện di chuyển nào tiện nhất ở Hà Nội?": `🚗 **Phương tiện di chuyển Hà Nội:**

**1. Xe máy (Khuyến nghị)**
• **Thuê xe**: 100-150k/ngày
• **Ưu điểm**: Linh hoạt, tiết kiệm thời gian
• **Lưu ý**: Cần bằng lái, đội mũ bảo hiểm

**2. Grab/Taxi**
• **Grab**: 15-25k/km (rẻ nhất)
• **Taxi**: 12-15k/km + phí mở cửa
• **Ưu điểm**: An toàn, không cần bằng lái

**3. Xe buýt**
• **Giá**: 7-9k/lượt
• **Tuyến**: 100+ tuyến khắp thành phố
• **App**: BusMap, NextBus để tra cứu

**4. Xe đạp**
• **Thuê**: 30-50k/ngày
• **Tuyệt vời**: Dạo phố cổ, hồ Tây
• **Lưu ý**: Cẩn thận giao thông

**5. Xe ôm**
• **Giá**: 20-30k/điểm gần
• **Phù hợp**: Đi ngắn, không biết đường

💡 **Gợi ý**: Kết hợp nhiều phương tiện tùy khoảng cách!`,

  "Top điểm check-in đẹp nhất Hà Nội": `📸 **Top điểm check-in Hà Nội:**

**🏛️ Địa điểm lịch sử:**
• **Hồ Gươm** - Cầu Thê Húc, Đền Ngọc Sơn
• **Văn Miếu** - Kiến trúc cổ kính, vườn hoa
• **Lăng Bác** - Quảng trường Ba Đình
• **Chùa Một Cột** - Biểu tượng Hà Nội

**🏙️ Phố cổ & Hiện đại:**
• **Phố cổ Hà Nội** - 36 phố phường
• **Phố đi bộ Hồ Gươm** - Cuối tuần
• **Sky Bar** - Tầng thượng khách sạn
• **Cầu Long Biên** - Hoàng hôn đẹp

**🌿 Thiên nhiên:**
• **Hồ Tây** - Sunset, cà phê ven hồ
• **Công viên Thủ Lệ** - Vườn thú
• **Phố sách Đinh Lễ** - Không gian văn hóa

**🍜 Ẩm thực check-in:**
• **Cà phê trứng** - Cà phê Giảng
• **Phở bò** - Phở Gia Truyền
• **Bún chả** - Bún chả Obama

**📱 Tips chụp ảnh:**
• **Thời gian**: 6-8h sáng, 5-7h chiều
• **Góc chụp**: Tầm thấp, góc xiên
• **Hashtag**: #HanoiVibes #HanoiTravel`,

  "Khách sạn nào tốt gần Hồ Gươm?": `🏨 **Khách sạn tốt gần Hồ Gươm:**

**⭐ 5 sao (Luxury):**
• **Sofitel Legend Metropole** - 15 Ngo Quyen (2.5-4 triệu/đêm)
• **Hanoi La Siesta Hotel** - 94 Ma May (1.5-2.5 triệu/đêm)
• **The Oriental Jade Hotel** - 92 Hang Trong (1.2-2 triệu/đêm)

**⭐ 4 sao (Boutique):**
• **Hanoi Elegance Hotel** - 85 Ma May (800k-1.2 triệu/đêm)
• **Golden Silk Boutique** - 95 Hang Bong (600k-900k/đêm)
• **Hanoi Old Quarter Hotel** - 50 Hang Be (500k-800k/đêm)

**⭐ 3 sao (Budget-friendly):**
• **Hanoi Central Hotel** - 42 Hang Be (300k-500k/đêm)
• **Little Hanoi Hotel** - 48 Hang Be (250k-400k/đêm)
• **Hanoi Backpackers Hostel** - 48 Ngo Huyen (150k-300k/đêm)

**🏠 Homestay:**
• **Hanoi Old Quarter Homestay** - 50 Hang Be (200k-350k/đêm)
• **Little Hanoi Diamond** - 32 Hang Be (180k-300k/đêm)

**📍 Vị trí tốt nhất:**
• **Hang Be, Ma May** - Gần Hồ Gươm nhất
• **Hang Trong, Hang Bong** - Yên tĩnh, dễ di chuyển
• **Ngo Quyen** - Đường lớn, nhiều tiện ích

**💡 Mẹo đặt phòng:**
• Đặt trước 1-2 tuần để có giá tốt
• Kiểm tra đánh giá trên Booking.com
• Ưu tiên khách sạn có ban công nhìn ra Hồ Gươm`,

  "Lịch sử và văn hóa Hà Nội": `🏛️ **Lịch sử & Văn hóa Hà Nội:**

**📚 Lịch sử 1000 năm:**
• **1010**: Lý Thái Tổ dời đô từ Hoa Lư về Thăng Long
• **1802**: Nguyễn Ánh đổi tên thành Hà Nội
• **1954**: Giải phóng Thủ đô khỏi thực dân Pháp
• **1976**: Trở thành Thủ đô nước CHXHCN Việt Nam

**🏛️ Di tích lịch sử:**
• **Văn Miếu** (1070) - Trường đại học đầu tiên
• **Chùa Một Cột** (1049) - Biểu tượng Hà Nội
• **Lăng Chủ tịch Hồ Chí Minh** - Nơi an nghỉ của Bác
• **Nhà tù Hỏa Lò** - Di tích lịch sử

**🎭 Văn hóa truyền thống:**
• **Ca trù** - Nghệ thuật ca hát cổ
• **Hát xẩm** - Nghệ thuật đường phố
• **Múa rối nước** - Đặc sản văn hóa
• **Lễ hội** - Lễ hội Gióng, Lễ hội Chùa Hương

**🍜 Ẩm thực văn hóa:**
• **Phở** - Món ăn quốc hồn quốc túy
• **Bún chả** - Đặc sản phố cổ
• **Chả cá** - Món ăn cung đình
• **Cà phê trứng** - Sáng tạo độc đáo

**🏘️ Kiến trúc:**
• **Phố cổ** - 36 phố phường
• **Kiến trúc Pháp** - Nhà hát Lớn, Bưu điện
• **Kiến trúc hiện đại** - Landmark 72, Keangnam

**📖 Văn học:**
• **Thơ Hồ Xuân Hương** - Nữ sĩ tài hoa
• **Truyện Kiều** - Nguyễn Du
• **Văn học hiện đại** - Nam Cao, Vũ Trọng Phụng

**🎨 Nghệ thuật:**
• **Tranh dân gian** - Đông Hồ, Hàng Trống
• **Gốm sứ** - Làng gốm Bát Tràng
• **Thêu** - Làng thêu Quất Động`
};

// Add variations for better matching
const TEMPLATE_VARIATIONS = {
  // Lịch trình 2 ngày
  "Gợi ý lịch trình 2 ngày ở Hà Nội": TEMPLATE_RESPONSES["Gợi ý lịch trình 2 ngày ở Hà Nội?"],
  "Lịch trình 2 ngày ở Hà Nội": TEMPLATE_RESPONSES["Gợi ý lịch trình 2 ngày ở Hà Nội?"],
  "2 ngày ở Hà Nội": TEMPLATE_RESPONSES["Gợi ý lịch trình 2 ngày ở Hà Nội?"],
  
  // Ẩm thực Phố cổ
  "Ăn gì ngon ở Phố cổ Hà Nội": TEMPLATE_RESPONSES["Ăn gì ngon ở Phố cổ Hà Nội?"],
  "Ăn gì ở Phố cổ": TEMPLATE_RESPONSES["Ăn gì ngon ở Phố cổ Hà Nội?"],
  "Món ngon Phố cổ": TEMPLATE_RESPONSES["Ăn gì ngon ở Phố cổ Hà Nội?"],
  
  // Phương tiện di chuyển
  "Phương tiện di chuyển nào tiện nhất ở Hà Nội": TEMPLATE_RESPONSES["Phương tiện di chuyển nào tiện nhất ở Hà Nội?"],
  "Phương tiện di chuyển Hà Nội": TEMPLATE_RESPONSES["Phương tiện di chuyển nào tiện nhất ở Hà Nội?"],
  "Đi lại ở Hà Nội": TEMPLATE_RESPONSES["Phương tiện di chuyển nào tiện nhất ở Hà Nội?"],
  
  // Điểm check-in
  "Top điểm check-in đẹp nhất Hà Nội": TEMPLATE_RESPONSES["Top điểm check-in đẹp nhất Hà Nội"],
  "Điểm check-in Hà Nội": TEMPLATE_RESPONSES["Top điểm check-in đẹp nhất Hà Nội"],
  "Chụp ảnh đẹp Hà Nội": TEMPLATE_RESPONSES["Top điểm check-in đẹp nhất Hà Nội"],
  
  // Khách sạn
  "Khách sạn nào tốt gần Hồ Gươm": TEMPLATE_RESPONSES["Khách sạn nào tốt gần Hồ Gươm?"],
  "Khách sạn gần Hồ Gươm": TEMPLATE_RESPONSES["Khách sạn nào tốt gần Hồ Gươm?"],
  "Nơi ở gần Hồ Gươm": TEMPLATE_RESPONSES["Khách sạn nào tốt gần Hồ Gươm?"],
  
  // Văn hóa
  "Lịch sử và văn hóa Hà Nội": TEMPLATE_RESPONSES["Lịch sử và văn hóa Hà Nội"],
  "Văn hóa Hà Nội": TEMPLATE_RESPONSES["Lịch sử và văn hóa Hà Nội"],
  "Lịch sử Hà Nội": TEMPLATE_RESPONSES["Lịch sử và văn hóa Hà Nội"]
};

// Merge original templates with variations
Object.assign(TEMPLATE_RESPONSES, TEMPLATE_VARIATIONS);

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.trim() }))
    .slice(-30); // Increased context window
}

// Enhanced rate limiting with global load balancing
function checkRateLimit(clientIP) {
  const now = Date.now();
  
  // Check global load
  if (globalRequestCount >= MAX_GLOBAL_CONCURRENT) {
    return false;
  }
  
  if (RATE_LIMIT.has(clientIP)) {
    const lastRequest = RATE_LIMIT.get(clientIP);
    if (now - lastRequest < RATE_LIMIT_DURATION) {
      return false;
    }
  }
  
  // Check concurrent requests per IP
  const currentRequests = REQUEST_QUEUE.get(clientIP) || 0;
  if (currentRequests >= MAX_CONCURRENT_REQUESTS) {
    return false;
  }
  
  RATE_LIMIT.set(clientIP, now);
  REQUEST_QUEUE.set(clientIP, currentRequests + 1);
  globalRequestCount++;
  return true;
}

// Release rate limit with global counter
function releaseRateLimit(clientIP) {
  const currentRequests = REQUEST_QUEUE.get(clientIP) || 0;
  if (currentRequests > 0) {
    REQUEST_QUEUE.set(clientIP, currentRequests - 1);
  }
  if (globalRequestCount > 0) {
    globalRequestCount--;
  }
}

// Enhanced retry logic for API calls
async function callGeminiWithRetry(payload, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: payload.contents,
        generationConfig: payload.generationConfig
      });
      
      if (response && response.text) {
        return { success: true, data: response.text };
      }
      
      throw new Error('Empty response from Gemini');
    } catch (error) {
      console.error(`Gemini API attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        return { success: false, error: error.message };
      }
      
      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Smart prompt selection based on user input
function selectSystemPrompt(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('ăn') || message.includes('món') || message.includes('quán') || 
      message.includes('nhà hàng') || message.includes('cafe') || message.includes('đồ uống')) {
    return SYSTEM_PROMPTS.food;
  }
  
  if (message.includes('đi đâu') || message.includes('thăm quan') || message.includes('du lịch') ||
      message.includes('lịch trình') || message.includes('tour') || message.includes('địa điểm')) {
    return SYSTEM_PROMPTS.travel;
  }
  
  return SYSTEM_PROMPTS.default;
}

exports.handleChatCompletion = async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  try {
    const { messages, user_id, session_id } = req.body || {};
    const history = normalizeMessages(messages);
    
    // Enhanced rate limiting with queue management
    if (!checkRateLimit(clientIP)) {
      return res.json({ 
        role: 'assistant', 
        content: 'Hệ thống đang bận, vui lòng thử lại sau vài giây.',
        meta: { type: 'rate_limit' }
      });
    }
    
    const now = Date.now();
    
    // Enhanced cache check with better key generation
    const cacheKey = JSON.stringify({ 
      messages: history.slice(-5), // Only cache last 5 messages for better hit rate
      user_id: user_id || 'anonymous'
    });
    
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        releaseRateLimit(clientIP);
        return res.json(cached.response);
      } else {
        responseCache.delete(cacheKey);
      }
    }

    // Get the last user message for smart prompt selection
    const lastUserMessage = history.findLast ? history.findLast(m => m.role === 'user') : [...history].reverse().find(m => m.role === 'user');
    
    // Check if this is a template question first
    if (lastUserMessage) {
      const userMessage = lastUserMessage.content.trim();
      console.log('🔍 Checking template for:', userMessage);
      
      // Try exact match first
      if (TEMPLATE_RESPONSES[userMessage]) {
        console.log('🎯 Exact template match found');
        const templateResponse = TEMPLATE_RESPONSES[userMessage];
        const responseData = { role: 'assistant', content: templateResponse };
        
        // Save chat history asynchronously
        if (user_id && session_id) {
          setImmediate(() => saveChatHistory(user_id, session_id, history, responseData));
        }
        
        releaseRateLimit(clientIP);
        return res.json(responseData);
      }
      
      // Try fuzzy matching for common variations
      const templateKeys = Object.keys(TEMPLATE_RESPONSES);
      const matchedKey = templateKeys.find(key => {
        // Normalize both strings: remove extra spaces, convert to lowercase, remove punctuation
        const normalize = (str) => str.toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(/[.,!?;:]/g, '')
          .trim();
        
        const normalizedKey = normalize(key);
        const normalizedMessage = normalize(userMessage);
        
        console.log('Comparing:', normalizedKey, 'vs', normalizedMessage);
        
        return normalizedKey === normalizedMessage || 
               normalizedMessage.includes(normalizedKey) ||
               normalizedKey.includes(normalizedMessage);
      });
      
      if (matchedKey) {
        console.log('🎯 Fuzzy template match found for:', matchedKey);
        const templateResponse = TEMPLATE_RESPONSES[matchedKey];
        const responseData = { role: 'assistant', content: templateResponse };
        
        // Save chat history asynchronously
        if (user_id && session_id) {
          setImmediate(() => saveChatHistory(user_id, session_id, history, responseData));
        }
        
        releaseRateLimit(clientIP);
        return res.json(responseData);
      }
      
      console.log('❌ No template match found');
      console.log('Available templates:', templateKeys);
    }
    
    const systemPreamble = lastUserMessage ? selectSystemPrompt(lastUserMessage.content) : SYSTEM_PROMPTS.default;

    // Convert to Gemini's content format with better structure
    const contents = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: systemPreamble }] },
        ...contents
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024, // Increased token limit
        candidateCount: 1
      }
    };
    
    // If no API key, gracefully degrade with local reply
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_KEY_HERE') {
      releaseRateLimit(clientIP);
      const fallback = lastUserMessage && lastUserMessage.content
        ? `(Chế độ demo) Bạn hỏi: "${lastUserMessage.content}". Hiện chưa cấu hình khóa AI, vui lòng liên hệ quản trị viên.`
        : '(Chế độ demo) Xin chào! Tôi là ViA - trợ lý du lịch Hà Nội. Bạn muốn hỏi gì?';
      return res.json({ role: 'assistant', content: fallback });
    }
    
    // Call Gemini with enhanced retry logic
    const result = await callGeminiWithRetry(payload);
    
    if (result.success) {
      const responseData = { role: 'assistant', content: result.data };
      
      // Enhanced caching with TTL
      responseCache.set(cacheKey, {
        response: responseData,
        timestamp: now
      });
      
      // Clean old cache entries periodically
      if (Math.random() < 0.1) { // 10% chance to clean
        cleanOldCache();
      }
      
      // Save chat history asynchronously (don't block response)
      if (user_id && session_id) {
        setImmediate(() => saveChatHistory(user_id, session_id, history, responseData));
      }
      
      releaseRateLimit(clientIP);
      return res.json(responseData);
    } else {
      releaseRateLimit(clientIP);
      console.error('Gemini API failed after retries:', result.error);
      
      // Fallback responses based on error type
      let fallbackMessage = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
      
      if (result.error.includes('quota') || result.error.includes('limit')) {
        fallbackMessage = 'Hệ thống đang quá tải, vui lòng thử lại sau ít phút.';
      } else if (result.error.includes('network') || result.error.includes('timeout')) {
        fallbackMessage = 'Kết nối mạng không ổn định, vui lòng thử lại.';
      }
      
      return res.json({ 
        role: 'assistant', 
        content: fallbackMessage,
        meta: { type: 'api_error', retry: true }
      });
    }
    
  } catch (err) {
    releaseRateLimit(clientIP);
    console.error('Chat completion error:', err);
    
    // Always return 200 to avoid client errors
    res.json({ 
      role: 'assistant', 
      content: 'Xin lỗi, đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
      meta: { type: 'system_error', error: err.message }
    });
  }
};

// Enhanced cache management with memory optimization
function cleanOldCache() {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      keysToDelete.push(key);
    }
  }
  
  // Batch delete for better performance
  keysToDelete.forEach(key => responseCache.delete(key));
  
  // If cache is still too large, remove oldest entries
  if (responseCache.size > 1000) {
    const entries = Array.from(responseCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, Math.floor(entries.length * 0.2)); // Remove 20% oldest
    toRemove.forEach(([key]) => responseCache.delete(key));
  }
}

// Periodic cache cleanup
setInterval(cleanOldCache, 5 * 60 * 1000); // Every 5 minutes

// Memory usage monitoring
function getCacheStats() {
  return {
    cacheSize: responseCache.size,
    globalRequests: globalRequestCount,
    queueSize: GLOBAL_QUEUE.length,
    memoryUsage: process.memoryUsage()
  };
}

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

// Function để monitor hệ thống chatbot
exports.getSystemStats = async (req, res) => {
  try {
    const stats = getCacheStats();
    
    res.json({
      success: true,
      data: {
        ...stats,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        geminiModel: GEMINI_MODEL,
        hasApiKey: !!(GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_KEY_HERE'),
        templateCount: Object.keys(TEMPLATE_RESPONSES).length,
        availableTemplates: Object.keys(TEMPLATE_RESPONSES)
      }
    });
  } catch (error) {
    console.error('Error getting system stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function để test template matching
exports.testTemplateMatching = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const userMessage = message.trim();
    console.log('🧪 Testing template matching for:', userMessage);
    
    // Try exact match
    const exactMatch = TEMPLATE_RESPONSES[userMessage];
    if (exactMatch) {
      return res.json({
        success: true,
        matchType: 'exact',
        template: userMessage,
        response: exactMatch
      });
    }
    
    // Try fuzzy matching
    const templateKeys = Object.keys(TEMPLATE_RESPONSES);
    const matchedKey = templateKeys.find(key => {
      // Normalize both strings: remove extra spaces, convert to lowercase, remove punctuation
      const normalize = (str) => str.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[.,!?;:]/g, '')
        .trim();
      
      const normalizedKey = normalize(key);
      const normalizedMessage = normalize(userMessage);
      
      return normalizedKey === normalizedMessage || 
             normalizedMessage.includes(normalizedKey) ||
             normalizedKey.includes(normalizedMessage);
    });
    
    if (matchedKey) {
      return res.json({
        success: true,
        matchType: 'fuzzy',
        template: matchedKey,
        response: TEMPLATE_RESPONSES[matchedKey]
      });
    }
    
    return res.json({
      success: false,
      matchType: 'none',
      message: 'No template match found',
      availableTemplates: templateKeys
    });
    
  } catch (error) {
    console.error('Error testing template matching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


