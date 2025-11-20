const express = require('express');
const router = express.Router();
const { callGemini } = require('../gemini');

router.post('/', async (req, res) => {
  try {
    const { description, audience } = req.body;

    const prompt = `You are an expert ad copywriter. Output ONLY valid JSON in the exact format below (no extra text):\n{\n  "headlines": ["...","..."],\n  "adText": "...",\n  "ctas": ["...","..."]\n}\nGenerate ad copy for the following product/service:\nDescription: ${description}\nAudience: ${audience}\nProvide 2 strong headline options, a persuasive short ad text (1-2 sentences), and 2 CTAs.`;

    const result = await callGemini(prompt, { max_tokens: 1024 });

    if (result && result.parsed && typeof result.parsed === 'object' && (result.parsed.headlines || result.parsed.adText || result.parsed.ctas)) {
      return res.json(result.parsed);
    }

    // Try to parse the extracted text as JSON (this is where the model's JSON response should be)
    if (result && result.text) {
      try {
        // Remove markdown code blocks if present
        let jsonText = result.text.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        const parsed = JSON.parse(jsonText);
        if (parsed.headlines || parsed.adText || parsed.ctas) {
          return res.json(parsed);
        }
      } catch (e) {
        // Continue to next fallback
      }
    }

    if (result && typeof result.parsed === 'string') {
      try {
        const parsed = JSON.parse(result.parsed);
        return res.json(parsed);
      } catch (e) {
        return res.status(502).json({ error: 'Invalid JSON-string response from Gemini', raw: result.raw, text: result.text });
      }
    }

    if (result && result.raw) {
      try {
        const parsed = JSON.parse(result.raw);
        return res.json(parsed);
      } catch (e) {
        return res.status(502).json({ error: 'Invalid response from Gemini', raw: result.raw, text: result.text });
      }
    }

    return res.status(500).json({ error: 'Unexpected response shape from Gemini', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
