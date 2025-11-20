# AI-Powered Digital Marketing Automation Tool

A full-stack web application that automates digital marketing content generation using Google Gemini AI. This tool helps marketers save time by automatically generating social media posts, ad copy, and email campaigns.

## Features

### 1. Social Media Post Generator
Generate platform-specific social media content for LinkedIn, Instagram, and Twitter.

**Input:**
- Business Type (e.g., Restaurant, E-commerce, SaaS)
- Product/Service Name
- Tone (Friendly, Professional, Casual, etc.)
- Target Audience

**Output:**
- LinkedIn post (professional format)
- Instagram post (engaging with emojis)
- Twitter/X post (concise format)

### 2. Ad Copy Creator
Create compelling ad copy with multiple headline options and CTAs.

**Input:**
- Product/Service Description
- Target Audience

**Output:**
- 2 headline options
- Persuasive ad text (1-2 sentences)
- 2 call-to-action (CTA) suggestions

### 3. Email Campaign Writer
Generate complete email campaigns with subject lines and body content.

**Input:**
- Recipient Persona (e.g., "Health-conscious professionals", "College students")
- Campaign Goal (e.g., "Lead nurturing", "Product promotion", "Newsletter")

**Output:**
- Attention-grabbing subject line
- Email body content
- Clear call-to-action

## Tech Stack

- **Backend:** Node.js + Express.js
- **Frontend:** React + Vite + Tailwind CSS
- **AI Integration:** Google Gemini API (gemini-2.0-flash)
- **Routing:** React Router DOM

## Prerequisites

- Node.js (18+ recommended)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Installation

1. **Clone or download the project**

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Or set environment variables (PowerShell):
```powershell
$env:GEMINI_API_KEY = 'YOUR_API_KEY'
$env:GEMINI_MODEL = 'gemini-2.0-flash'
```

## Running the Application

### Option 1: Run both servers concurrently
```bash
npm run dev
```

### Option 2: Run servers separately

**Terminal 1 - Backend:**
```bash
npm run server
```
Backend runs on: `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
npm run client
```
Frontend runs on: `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Use the navigation bar to access different tools:
   - **Social Media** - Generate social media posts
   - **Ad Copy** - Create ad copy
   - **Email Writer** - Generate email campaigns

3. Fill in the required fields and click "Generate"
4. Copy the generated content for your marketing campaigns

## API Endpoints

### Social Media Posts
- **Endpoint:** `POST http://localhost:4000/api/social-posts`
- **Request Body:**
```json
{
  "businessType": "Restaurant",
  "product": "Veg Biryani",
  "tone": "Friendly",
  "audience": "College students"
}
```
- **Response:**
```json
{
  "linkedin": "...",
  "instagram": "...",
  "twitter": "..."
}
```

### Ad Copy
- **Endpoint:** `POST http://localhost:4000/api/ad-copy`
- **Request Body:**
```json
{
  "description": "Premium reusable water bottle",
  "audience": "Health-conscious professionals"
}
```
- **Response:**
```json
{
  "headlines": ["...", "..."],
  "adText": "...",
  "ctas": ["...", "..."]
}
```

### Email Campaign
- **Endpoint:** `POST http://localhost:4000/api/email-campaign`
- **Request Body:**
```json
{
  "persona": "Small business owners",
  "goal": "Product promotion"
}
```
- **Response:**
```json
{
  "subject": "...",
  "body": "...",
  "cta": "..."
}
```

## Project Structure

```
ai_tool/
├── server/
│   ├── routes/
│   │   ├── socialPosts.js    # Social media post generation
│   │   ├── adCopy.js         # Ad copy generation
│   │   └── emailCampaign.js  # Email campaign generation
│   ├── gemini.js             # Gemini API integration
│   └── server.js             # Express server setup
├── src/
│   ├── pages/
│   │   ├── SocialPosts.jsx   # Social media UI
│   │   ├── AdCopy.jsx        # Ad copy UI
│   │   └── EmailWriter.jsx   # Email campaign UI
│   ├── components/
│   │   └── Navbar.jsx        # Navigation component
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
├── .env                      # Environment variables (create this)
└── package.json              # Dependencies
```

## Example Outputs

### Social Media Post Example:
- **LinkedIn:** Professional post with industry-relevant hashtags
- **Instagram:** Engaging post with emojis and visual language
- **Twitter:** Concise post within character limit

### Ad Copy Example:
- **Headlines:** "Stay Hydrated in Style: Introducing the Premium Reusable Bottle"
- **Ad Text:** Compelling 1-2 sentence description
- **CTAs:** "Shop Now", "Discover More"

### Email Campaign Example:
- **Subject:** "🌸 Spring into Savings! Up to 50% OFF!"
- **Body:** Engaging email content
- **CTA:** "Shop the Sale!"

## Troubleshooting

### API Key Issues
- Ensure your Gemini API key is valid and has access to the model
- Check that `GEMINI_MODEL` is set to an available model (e.g., `gemini-2.0-flash`)

### Port Already in Use
- If port 4000 or 5173 is in use, stop the process or change ports in the configuration

### CORS Errors
- Ensure both servers are running
- Check that frontend is calling `http://localhost:4000` (not a different port)

## Future Improvements

- Add SEO Meta Tag Generator
- Implement Marketing Analytics Summarizer
- Add agentic workflows for content optimization
- Support for more AI models
- Content history and saving functionality
- Export generated content to various formats

## License

This project is for educational/demonstration purposes.

## Author

Digital Marketing Automation Tool - AI-Powered Content Generation
