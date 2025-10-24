# 🚀 Deploy Backend to Render (Free) - Step by Step

## Why Render?
- ✅ **Completely FREE** (no credit card required)
- ✅ Automatic deployments from GitHub
- ✅ Environment variables support (secure API keys)
- ✅ 750 hours/month free (enough for 24/7)
- ✅ HTTPS included

## Step-by-Step Instructions

### Step 1: Push Latest Changes to GitHub

```powershell
cd C:\Users\Ratan\Desktop\StarBot

git add .
git commit -m "Add Render deployment configuration"
git push
```

### Step 2: Sign Up for Render

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your GitHub account

### Step 3: Create New Web Service

1. On Render Dashboard, click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find **"RatanRavichandran/StarBot"** and click **"Connect"**

### Step 4: Configure the Service

Fill in these settings:

**Basic Settings:**
- **Name:** `starbot-backend` (or any name you like)
- **Region:** Choose closest to you (e.g., Singapore for India)
- **Branch:** `main`
- **Root Directory:** Leave blank
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Plan:**
- Select **"Free"** plan (scroll down to find it)

### Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section:

Click **"Add Environment Variable"** and add these:

1. **Key:** `OPENAI_API_KEY`
   - **Value:** [Your OpenAI API key - get from https://platform.openai.com/api-keys]

2. **Key:** `SERPAPI_KEY` (optional)
   - **Value:** [Your SerpAPI key - get from https://serpapi.com/manage-api-key]

3. **Key:** `NODE_ENV`
   - **Value:** `production`

4. **Key:** `PORT`
   - **Value:** `10000`

### Step 6: Deploy!

1. Click **"Create Web Service"** (bottom of page)
2. Wait 2-5 minutes for deployment
3. You'll see build logs in real-time
4. When complete, you'll see: **"Your service is live 🎉"**

### Step 7: Copy Your Backend URL

After deployment succeeds:

1. At the top of the page, copy your URL
2. It will look like: `https://starbot-backend-xxxx.onrender.com`
3. Copy this URL!

### Step 8: Update Frontend Config

Now update your frontend to use the Render backend:

Open `js/config.js` and replace the Render URL:

```javascript
BACKEND_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3001/api' 
    : 'https://starbot-backend-xxxx.onrender.com/api', // <-- Replace with YOUR URL
```

### Step 9: Push Updated Config

```powershell
git add js/config.js
git commit -m "Update backend URL for Render deployment"
git push
```

GitHub Pages will automatically redeploy in 1-2 minutes!

### Step 10: Test Your Live Site! 🎉

Visit:
```
https://ratanravichandran.github.io/StarBot/
```

Everything should work with your secure backend!

---

## 🔍 Troubleshooting

### Backend Not Responding?
1. Check Render dashboard for errors
2. Click "Logs" tab to see error messages
3. Verify environment variables are set correctly
4. Make sure service status is "Live"

### Frontend Can't Connect?
1. Check browser console for errors
2. Verify BACKEND_URL in config.js is correct
3. Make sure URL ends with `/api` (not just the domain)
4. Hard refresh browser: `Ctrl + Shift + R`

### API Key Errors?
1. Go to Render dashboard
2. Click your service
3. Go to "Environment" tab
4. Verify `OPENAI_API_KEY` is set
5. Click "Save Changes" if you edited them
6. Service will auto-redeploy

### Build Failed?
- Check that `package.json` exists in root
- Verify `npm install` and `npm start` work locally
- Check Render logs for specific error messages

---

## 💰 Free Tier Limits

Render Free Tier includes:
- ✅ 750 hours/month (enough for 24/7 in a 30-day month)
- ✅ Automatic HTTPS
- ⚠️ Service "spins down" after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ✅ Unlimited deployments

**Note:** The cold start delay is normal for free tier. Users will see a loading indicator.

---

## 🚀 Your URLs

After deployment, you'll have:

1. **Backend API:** `https://starbot-backend-xxxx.onrender.com`
2. **Frontend:** `https://ratanravichandran.github.io/StarBot/`

Both work together - backend handles API keys securely, frontend provides the UI!

---

## 📝 Future Updates

To update your backend code:

1. Make changes to `server.js` or other files
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Update backend"
   git push
   ```
3. Render automatically redeploys (watch in dashboard)

---

## ✅ Verification Steps

After deployment, test these endpoints:

1. **Health Check:**
   ```
   https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"StarBot Backend Server is running"}`

2. **From Browser Console (on your GitHub Pages site):**
   ```javascript
   fetch(CONFIG.BACKEND_URL + '/health').then(r => r.json()).then(console.log)
   ```
   Should log the health check response

If both work, you're all set! 🎉

---

**Need help?** Check Render's logs tab for detailed error messages!
