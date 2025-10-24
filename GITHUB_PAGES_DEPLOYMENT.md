# 🚀 GitHub Pages Deployment Guide

## Prerequisites
- GitHub account (username: RatanRavichandran)
- Git installed on your computer
- Your StarBot project ready

## Step-by-Step Deployment

### Step 1: Initialize Git Repository (if not already done)

Open PowerShell in your StarBot folder and run:

```powershell
cd C:\Users\Ratan\Desktop\StarBot
git init
```

### Step 2: Create a New Repository on GitHub

1. Go to **https://github.com/new**
2. **Repository name:** `StarBot` (or `starbot` - lowercase recommended)
3. **Description:** "✨ what you probably cant see when you look up - Real-time sky object detector with animated stars"
4. **Visibility:** Choose **Public** (required for free GitHub Pages)
5. **DO NOT** check "Add a README file" (you already have one)
6. **DO NOT** add .gitignore or license (you already have them)
7. Click **"Create repository"**

### Step 3: Configure API Keys for GitHub Pages

⚠️ **IMPORTANT:** Your backend server won't run on GitHub Pages (it's static hosting only).

You have two options:

#### Option A: Client-Side Only (Recommended for GitHub Pages)

Update `js/config.js` to disable the backend and use direct API calls:

```javascript
const CONFIG = {
    // ... other config ...
    USE_BACKEND: false,  // Change this to false
    
    // Add your API keys here (will be visible in source - use with caution)
    OPENAI_API_KEY: 'your-openai-key-here',
    SERPAPI_KEY: 'your-serpapi-key-here', // optional
    
    // ... rest of config
};
```

⚠️ **Security Note:** API keys will be visible in browser. Only use keys with rate limits/quotas set!

#### Option B: Deploy Backend Separately (Advanced)

Deploy your backend to:
- **Vercel** (free tier available)
- **Heroku** (free tier available)
- **Railway** (free tier available)
- **Render** (free tier available)

Then update `BACKEND_URL` in `js/config.js` to point to your deployed backend.

### Step 4: Commit Your Code

```powershell
# Add all files
git add .

# Make your first commit
git commit -m "Initial commit - StarBot with animated stars and swag effects"
```

### Step 5: Connect to GitHub and Push

Replace the URL with your actual repository:

```powershell
# Add remote repository
git remote add origin https://github.com/RatanRavichandran/StarBot.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication errors:**
- Use a Personal Access Token instead of password
- Go to: **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
- Generate new token with `repo` scope
- Use this token as your password when prompted

### Step 6: Enable GitHub Pages

1. Go to your repository: `https://github.com/RatanRavichandran/StarBot`
2. Click **"Settings"** tab (top right)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **"Save"**
6. Wait 1-2 minutes for deployment

### Step 7: Access Your Live Site! 🎉

Your site will be available at:

```
https://ratanravichandran.github.io/StarBot/
```

Note: 
- Use **lowercase** for the repository name in the URL
- First deployment can take 2-5 minutes
- You'll see a green checkmark when it's ready

### Step 8: Update Config for GitHub Pages

After deployment, you may need to update `js/config.js`:

```javascript
const CONFIG = {
    USE_BACKEND: false,  // Static hosting, no backend
    
    // Your API keys (visible in source code!)
    OPENAI_API_KEY: 'sk-your-key-here',
    SERPAPI_KEY: '', // Leave empty if not using
    
    // Direct API endpoints (frontend will call these directly)
    HORIZONS_API: 'https://ssd.jpl.nasa.gov/api/horizons.api',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    SERP_API_URL: 'https://serpapi.com/search',
    
    // ... rest of config stays the same
};
```

Then commit and push the changes:

```powershell
git add js/config.js
git commit -m "Update config for GitHub Pages deployment"
git push
```

Wait 1-2 minutes and refresh your GitHub Pages site!

---

## 🔒 Security Best Practices

### API Key Security

Since GitHub Pages is static hosting, your API keys will be **visible in the browser source code**. To protect yourself:

1. **OpenAI API:**
   - Set usage limits in OpenAI dashboard
   - Set monthly budget cap ($5-10)
   - Use a separate key just for this project
   - Restrict by referer URL if possible

2. **SerpAPI:**
   - Only add if absolutely needed
   - Free tier gives 100 searches/month
   - Monitor usage regularly

### Better Alternative: Backend Deployment

For better security, deploy the backend separately:

**Recommended: Vercel (Easiest)**

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Deploy backend:
   ```powershell
   vercel
   ```

3. Update `BACKEND_URL` in `js/config.js`:
   ```javascript
   USE_BACKEND: true,
   BACKEND_URL: 'https://your-backend.vercel.app/api'
   ```

---

## 📝 Future Updates

To update your site after making changes:

```powershell
# 1. Make your changes to files

# 2. Commit changes
git add .
git commit -m "Description of changes"

# 3. Push to GitHub
git push

# 4. Wait 1-2 minutes for automatic redeployment
```

GitHub Pages automatically rebuilds when you push to the main branch!

---

## 🎨 Custom Domain (Optional)

Want a custom domain like `starbot.yourname.com`?

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In your repository **Settings** → **Pages**
3. Enter your custom domain
4. Update DNS records at your domain provider:
   - Add CNAME record pointing to `ratanravichandran.github.io`
5. Enable "Enforce HTTPS"

---

## 🐛 Troubleshooting

### Site Not Loading?
- Check repository is **Public**
- Check Pages is enabled with correct branch
- Wait 5 minutes after enabling
- Check Actions tab for deployment status

### 404 Errors on Resources?
- Make sure file paths are relative (no leading `/`)
- Check file names match exactly (case-sensitive on Linux servers)

### API Calls Failing?
- Check browser console for errors
- Make sure `USE_BACKEND: false` in config
- Verify API keys are valid
- Check for CORS errors (some APIs may block browser requests)

### Stars Not Animating?
- Hard refresh: `Ctrl + Shift + R`
- Check browser console for CSS errors
- Verify all CSS files loaded correctly

---

## ✅ Quick Checklist

- [ ] Repository created on GitHub
- [ ] `.env` file in `.gitignore` (not committed!)
- [ ] API keys configured (if using client-side)
- [ ] Code committed and pushed
- [ ] GitHub Pages enabled
- [ ] Site accessible at `ratanravichandran.github.io/StarBot`
- [ ] All features working (test thoroughly!)

---

**Your Live URL:** `https://ratanravichandran.github.io/StarBot/`

Enjoy your deployed StarBot! 🌟✨
