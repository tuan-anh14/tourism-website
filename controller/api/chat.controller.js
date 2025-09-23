// Use Gemini Generative Language API (models: gemini-1.5-flash-latest is good for chat)
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.trim() }))
    .slice(-20);
}

exports.handleChatCompletion = async (req, res) => {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_KEY_HERE') {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY', hint: 'Add GEMINI_API_KEY to your .env and restart the server.' });
    }

    const { messages } = req.body || {};
    const history = normalizeMessages(messages);

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    // Retry on 429 with exponential backoff (client also throttles)
    let data = null;
    let lastStatus = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const resp = await global.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      lastStatus = resp.status;
      if (resp.ok) { data = await resp.json(); break; }
      if (resp.status === 429) {
        const waitMs = 800 * Math.pow(1.6, attempt);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'Gemini API error', detail: text });
    }
    if (!data) {
      return res.status(429).json({ error: 'Gemini API rate limited', detail: 'Please try again shortly.' });
    }
    const candidate = data && data.candidates && data.candidates[0];
    const parts = candidate && candidate.content && candidate.content.parts;
    const text = parts && parts[0] && parts[0].text ? parts[0].text : 'Xin lỗi, hiện chưa có phản hồi.';

    res.json({ role: 'assistant', content: text });
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
};


