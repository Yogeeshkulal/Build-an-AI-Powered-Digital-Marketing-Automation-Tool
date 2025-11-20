const express = require('express');
const router = express.Router();
const { callGemini } = require('../gemini');

router.post('/', async (req, res) => {
  try {
    const { businessType, product, tone, audience } = req.body;

    const prompt = `You are a helpful marketing assistant. Output ONLY valid JSON in the exact format below (no extra text):\n{\n  "linkedin": "...",\n  "instagram": "...",\n  "twitter": "..."\n}\nGenerate social media posts for the following input:\nBusiness Type: ${businessType}\nProduct: ${product}\nTone: ${tone}\nAudience: ${audience}\nMake each platform-appropriate and concise.`;

    const result = await callGemini(prompt, { max_tokens: 1024 });

    // If helper returned a parsed object with the expected keys, forward it.
    if (result && result.parsed && typeof result.parsed === 'object' && (result.parsed.linkedin || result.parsed.instagram || result.parsed.twitter)) {
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
        if (parsed.linkedin || parsed.instagram || parsed.twitter) {
          return res.json(parsed);
        }
      } catch (e) {
        // Continue to next fallback
      }
    }

    // If parsed is a JSON string (primitive), try to parse it as JSON body.
    if (result && typeof result.parsed === 'string') {
      try {
        const parsed = JSON.parse(result.parsed);
        return res.json(parsed);
      } catch (e) {
        return res.status(502).json({ error: 'Invalid JSON-string response from Gemini', raw: result.raw, text: result.text });
      }
    }

    // As a last resort, try to parse the raw text as JSON (covers model output with extra noise).
    if (result && result.raw) {
      try {
        const parsed = JSON.parse(result.raw);
        return res.json(parsed);
      } catch (e) {
        return res.status(502).json({ error: 'Invalid response from Gemini', raw: result.raw, text: result.text });
      }
    }

    // Log the actual result for debugging
    console.error('Unexpected response shape from Gemini:', JSON.stringify(result, null, 2));
    return res.status(500).json({ 
      error: 'Unexpected response shape from Gemini', 
      result: {
        hasText: !!result?.text,
        hasParsed: !!result?.parsed,
        textPreview: result?.text?.substring(0, 200),
        parsedType: typeof result?.parsed,
        rawPreview: result?.raw?.substring(0, 500)
      }
    });
  } catch (err) {
    console.error('Error in socialPosts route:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
