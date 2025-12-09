const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { callGemini } = require('../gemini');

const CHAT_STORE_PATH = path.join(__dirname, '../chatStore.json');

// Helper function to read chat history
function readChatHistory() {
  try {
    const data = fs.readFileSync(CHAT_STORE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to save chat history
function saveChatHistory(history) {
  fs.writeFileSync(CHAT_STORE_PATH, JSON.stringify(history, null, 2), 'utf8');
}

// Format chat history into a prompt for Gemini
function formatChatHistoryForGemini(chatHistory) {
  if (chatHistory.length === 0) {
    return '';
  }
  
  let prompt = 'You are a helpful AI assistant. Here is the conversation history:\n\n';
  
  chatHistory.forEach((msg, idx) => {
    if (msg.role === 'user') {
      prompt += `User: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n\n`;
    }
  });
  
  prompt += 'Now respond to the user\'s latest message as the Assistant:';
  
  return prompt;
}

// POST /api/chat - Send message and get AI response
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Read existing chat history
    let chatHistory = readChatHistory();

    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    chatHistory.push(userMessage);

    // Format conversation for Gemini
    const prompt = formatChatHistoryForGemini(chatHistory);

    // Call Gemini API
    const result = await callGemini(prompt, { max_tokens: 2048, temperature: 0.7 });

    if (!result || !result.text) {
      throw new Error('No response from Gemini API');
    }

    const aiContent = result.text.trim();

    // Add AI message
    const aiMessage = {
      role: 'assistant',
      content: aiContent,
      timestamp: new Date().toISOString()
    };
    chatHistory.push(aiMessage);

    // Save updated chat history
    saveChatHistory(chatHistory);

    // Return full conversation
    res.json(chatHistory);
  } catch (err) {
    console.error('Error in chat route:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET /api/chat-history - Get all chat history
router.get('/history', async (req, res) => {
  try {
    const chatHistory = readChatHistory();
    res.json(chatHistory);
  } catch (err) {
    console.error('Error reading chat history:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;

