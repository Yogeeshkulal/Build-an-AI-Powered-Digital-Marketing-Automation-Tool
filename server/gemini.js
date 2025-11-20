const fetch = require('node-fetch');

/**
 * callGemini(prompt, options)
 * - Uses environment variables:
 *   - GEMINI_API_KEY (required)
 *   - GEMINI_MODEL (optional, default: text-bison-001)
 *   - GEMINI_API_BASE (optional, default will use Google's generativelanguage endpoint)
 *
 * The helper POSTs a JSON body suitable for Google's Generative Language REST API.
 * It returns an object { raw, parsed, text } where `parsed` is the full JSON response
 * and `text` is the best-effort extracted generated text.
 */
async function callGemini(prompt, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment');
  }

  // Get model from env or use default
  let requestedModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  if (requestedModel === 'text-bison-001' || requestedModel.includes('bison')) {
    console.warn('text-bison-001 is deprecated. Using Gemini models instead.');
    requestedModel = 'gemini-2.5-flash';
  }
  
  // List of model names to try (in order of preference)
  // Updated with actual available models from the API
  // Try gemini-2.0-flash first as it might not have thinking mode issues
  const modelsToTry = requestedModel.startsWith('gemini-') 
    ? [requestedModel] 
    : ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-pro-latest', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  
  // Try different API endpoints and formats
  let url, body, base, headers;
  // Try v1beta first (for newer Gemini models), then v1
  const apiVersions = ['v1beta', 'v1'];
  
  if (requestedModel.startsWith('gemini-') || modelsToTry.some(m => m.startsWith('gemini-'))) {
    // Try Gemini API with generateContent - try different models
    for (const model of modelsToTry) {
      for (const version of apiVersions) {
        base = `https://generativelanguage.googleapis.com/${version}`;
        url = `${base}/models/${model}:generateContent?key=${apiKey}`;
        body = {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: options.max_tokens || 2048, // Increased to handle thinking tokens if present
            temperature: typeof options.temperature === 'number' ? options.temperature : 0.7,
          }
        };
        headers = { 'Content-Type': 'application/json' };

        // Debug logging
        console.log(`Trying Gemini API (${version}, model: ${model}): ${url.substring(0, 100)}...`);
        
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
          });

          if (res.ok) {
            // Success! Continue with response processing
            console.log(`✓ Successfully using model: ${model} with API version: ${version}`);
            return await processGeminiResponse(res);
          } else {
            const errorText = await res.text().catch(() => '');
            // If 404, try next model/version combination
            if (res.status === 404) {
              console.log(`Model ${model} not found in ${version}, trying next...`);
              continue;
            }
            // For other errors, throw immediately
            let errorMessage = `Gemini API error (${res.status}): ${errorText}`;
            try {
              const errorJson = JSON.parse(errorText);
              if (errorJson.error && errorJson.error.message) {
                errorMessage = `Gemini API error (${res.status}): ${errorJson.error.message}`;
              }
            } catch (e) {
              // Keep the original error message
            }
            throw new Error(errorMessage);
          }
        } catch (err) {
          // If it's a network error or non-404, throw immediately
          if (!err.message.includes('404') && !err.message.includes('not found')) {
            throw err;
          }
          // Otherwise continue to next model/version
          continue;
        }
      }
    }
    // If we get here, all models and versions failed
    throw new Error(`Gemini API: Tried models ${modelsToTry.join(', ')} with API versions ${apiVersions.join(', ')}, but none worked. Please verify your API key has access to Gemini models.`);
  } else {
    // Legacy API structure (for text-bison-001, etc.)
    base = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1';
    url = `${base}/models/${model}:generate?key=${apiKey}`;
    body = {
      prompt: { text: prompt },
      maxOutputTokens: options.max_tokens || 512,
      temperature: typeof options.temperature === 'number' ? options.temperature : 0.7,
    };
    headers = { 'Content-Type': 'application/json' };

    console.log(`Calling Legacy API: ${url.substring(0, 100)}...`);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      let errorMessage = `Gemini API error (${res.status}): ${errorText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error && errorJson.error.message) {
          errorMessage = `Gemini API error (${res.status}): ${errorJson.error.message}`;
        }
      } catch (e) {
        // Keep the original error message
      }
      throw new Error(errorMessage);
    }
    
    return await processGeminiResponse(res);
  }
}

// Helper function to process Gemini API response
async function processGeminiResponse(res) {
  const parsed = await res.json().catch(() => null);
  const raw = parsed ? JSON.stringify(parsed) : await res.text().catch(() => '') ;

  // Debug: Log full response structure
  if (parsed) {
    console.log('Full API response structure:', JSON.stringify(parsed, null, 2).substring(0, 1500));
  }

  // Check for API errors in response
  if (parsed && parsed.error) {
    throw new Error(`Gemini API error: ${JSON.stringify(parsed.error)}`);
  }

  // Best-effort text extraction from known response shapes.
  let text = null;
  try {
    if (parsed) {
      // New Gemini API response structure:
      // { candidates: [{ content: { role: "model", parts: [{ text: "..." }] } }] }
      if (parsed.candidates && parsed.candidates[0]) {
        const candidate = parsed.candidates[0];
        
        // Log finishReason to understand why response might be empty
        console.log('Finish reason:', candidate.finishReason);
        
        // Check finishReason - if it's SAFETY, the response was blocked
        if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
          console.warn(`Response blocked - finishReason: ${candidate.finishReason}`);
          throw new Error(`Response was blocked (${candidate.finishReason}). Please try a different prompt.`);
        }
        
        // Check if finishReason indicates the response stopped early
        if (candidate.finishReason === 'MAX_TOKENS' || candidate.finishReason === 'OTHER') {
          console.warn(`Response may be incomplete - finishReason: ${candidate.finishReason}`);
        }
        
        // New Gemini API structure (content.parts[].text)
        if (candidate.content) {
          // Check if content has parts array
          if (candidate.content.parts && Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
            // Find the part with text
            for (const part of candidate.content.parts) {
              if (part.text) {
                text = part.text;
                break;
              }
            }
            // If no text found, try to get all text from all parts
            if (!text) {
              const allText = candidate.content.parts
                .filter(part => part.text)
                .map(part => part.text)
                .join('');
              if (allText) text = allText;
            }
          } else {
            // Parts array is missing or empty - log the full raw response for debugging
            console.error('Parts array missing or empty. Full candidate:', JSON.stringify(candidate, null, 2));
            console.error('Full parsed response (first 2000 chars):', JSON.stringify(parsed, null, 2).substring(0, 2000));
          }
          // Try if content itself is a string or has text property
          if (!text && typeof candidate.content === 'string') {
            text = candidate.content;
          }
          if (!text && candidate.content.text) {
            text = candidate.content.text;
          }
        }
        // Fallback to older structures
        if (!text) {
          text = candidate.output || candidate.text || null;
        }
      }
      // Legacy API structure (text-bison-001):
      // Try output array structure
      if (!text && parsed.output && parsed.output[0]) {
        text = parsed.output[0].content || parsed.output[0].text || null;
      }
      // Try generations array structure
      if (!text && parsed.generations && parsed.generations[0]) {
        text = parsed.generations[0].text || parsed.generations[0].content || null;
      }
      // Fallback to top-level properties
      if (!text && parsed.result) text = typeof parsed.result === 'string' ? parsed.result : JSON.stringify(parsed.result);
      if (!text && parsed.text) text = parsed.text;
    }
  } catch (e) {
    console.error('Error extracting text from Gemini response:', e);
    text = null;
  }

  // Log for debugging if text extraction failed
  if (!text && parsed) {
    console.warn('Could not extract text from Gemini response. Response keys:', Object.keys(parsed));
    if (parsed.candidates && parsed.candidates[0]) {
      const candidate = parsed.candidates[0];
      console.warn('Candidate structure:', Object.keys(candidate));
      if (candidate.content) {
        const content = candidate.content;
        console.warn('Content structure:', typeof content, Object.keys(content || {}));
        console.warn('Content full:', JSON.stringify(content, null, 2).substring(0, 1000));
        if (content.parts) {
          console.warn('Parts count:', content.parts.length);
          console.warn('Parts structure:', content.parts.map((p, i) => `Part ${i}: ${Object.keys(p).join(', ')}`));
          // Log first part in detail
          if (content.parts[0]) {
            console.warn('First part:', JSON.stringify(content.parts[0], null, 2));
          }
        }
      }
    }
  }

  return { raw, parsed, text };
}

// Helper function to list available models (for debugging)
async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment');
  }

  const versions = ['v1beta', 'v1'];
  for (const version of versions) {
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`Available models in ${version}:`, data.models?.map(m => m.name) || 'None');
        return data;
      }
    } catch (e) {
      console.log(`Could not list models in ${version}:`, e.message);
    }
  }
  return null;
}

module.exports = { callGemini, listAvailableModels };
