require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const socialPosts = require('./routes/socialPosts');
const adCopy = require('./routes/adCopy');
const emailCampaign = require('./routes/emailCampaign');
const chat = require('./routes/chat');
const { listAvailableModels } = require('./gemini');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/social-posts', socialPosts);
app.use('/api/ad-copy', adCopy);
app.use('/api/email-campaign', emailCampaign);
app.use('/api/chat', chat);

app.get('/', (req, res) => {
  res.json({ message: 'AI Marketing Automation API' });
});

// Endpoint to check available models (for debugging)
app.get('/api/check-models', async (req, res) => {
  try {
    const models = await listAvailableModels();
    res.json({ models, message: 'Check server console for detailed model list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
