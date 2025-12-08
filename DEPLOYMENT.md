# Deployment Guide

This guide will help you deploy the AI-Powered Digital Marketing Automation Tool to **Vercel** (frontend) and **Render** (backend).

## Prerequisites

- GitHub account with this repository pushed
- Google Gemini API key
- Accounts on [Vercel](https://vercel.com) and [Render](https://render.com)

---

## Step 1: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com)** and sign in

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `Build-an-AI-Powered-Digital-Marketing-Automation-Tool`

3. **Configure the Service**
   - **Name**: `ai-marketing-automation-api` (or any name you prefer)
   - **Root Directory**: `Build-an-AI-Powered-Digital-Marketing-Automation-Tool` (if deploying from a subdirectory)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Instance Type**: Free tier is fine to start

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add the following:
     - `GEMINI_API_KEY` = `your_gemini_api_key_here`
     - `GEMINI_MODEL` = `gemini-2.5-flash` (optional, this is the default)
     - `NODE_ENV` = `production`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - **Copy your Render URL** (e.g., `https://ai-marketing-automation-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)** and sign in

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select: `Build-an-AI-Powered-Digital-Marketing-Automation-Tool`

3. **Configure Project Settings**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `Build-an-AI-Powered-Digital-Marketing-Automation-Tool` (if deploying from subdirectory)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Set Environment Variables**
   - Go to "Environment Variables" section
   - Add:
     - `VITE_API_BASE` = `https://your-render-url.onrender.com` (use your Render backend URL from Step 1)
     - **Important**: Do NOT add `GEMINI_API_KEY` here (it stays on Render only)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - **Copy your Vercel URL** (e.g., `https://your-project.vercel.app`)

---

## Step 3: Verify Deployment

1. **Test Backend (Render)**
   - Visit: `https://your-render-url.onrender.com/`
   - Should see: `{"message":"AI Marketing Automation API"}`

2. **Test Frontend (Vercel)**
   - Visit your Vercel URL
   - Try generating a social media post
   - Check browser DevTools → Network tab to confirm API calls go to Render URL

---

## Troubleshooting

### Backend Issues

- **"GEMINI_API_KEY is not set"**: Double-check environment variables in Render dashboard
- **Cold Start Delay**: Render free tier spins down after inactivity. First request may take 30-60 seconds
- **Port Issues**: Render automatically sets `PORT` environment variable - your code already handles this

### Frontend Issues

- **API calls failing**: Verify `VITE_API_BASE` is set correctly in Vercel environment variables
- **CORS errors**: Ensure backend URL in `VITE_API_BASE` matches your Render URL exactly
- **Build fails**: Check Vercel build logs for dependency issues

### Common Mistakes

- ❌ Adding `GEMINI_API_KEY` to Vercel (should only be on Render)
- ❌ Forgetting to set `VITE_API_BASE` in Vercel
- ❌ Using `http://localhost:4000` in production (should use Render URL)

---

## Updating Deployments

### Backend Updates
- Push changes to GitHub
- Render will auto-deploy (if auto-deploy is enabled)
- Or manually trigger redeploy from Render dashboard

### Frontend Updates
- Push changes to GitHub
- Vercel will auto-deploy
- Or manually trigger redeploy from Vercel dashboard

---

## Environment Variables Summary

### Render (Backend)
```
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=production
```

### Vercel (Frontend)
```
VITE_API_BASE=https://your-render-url.onrender.com
```

---

## Cost

- **Render Free Tier**: 750 hours/month (enough for testing)
- **Vercel Free Tier**: Unlimited for personal projects
- **Total Cost**: $0/month for free tiers

---

## Support

If you encounter issues:
1. Check deployment logs in Render/Vercel dashboards
2. Verify environment variables are set correctly
3. Test backend API directly using curl or Postman
4. Check browser console for frontend errors

