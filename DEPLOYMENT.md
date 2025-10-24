# Deployment Guide for GitHub Pages

This guide will help you deploy "What's Above Me" to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your code in a local directory

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Name it `StarBot` (or any name you prefer)
5. Make it **Public** (required for free GitHub Pages)
6. Do NOT initialize with README (we already have one)
7. Click **Create repository**

### 2. Initialize Git and Push Code

Open a terminal in your StarBot directory and run:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - What's Above Me web app"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/StarBot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down and click **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**
6. Wait a few minutes for deployment

### 4. Access Your Live Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/StarBot/
```

GitHub will display the URL at the top of the Pages settings.

## Updating Your Site

After making changes to your code:

```powershell
git add .
git commit -m "Description of your changes"
git push
```

GitHub Pages will automatically rebuild your site within a few minutes.

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a file named `CNAME` to your repository with your domain:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS settings:
   - Add a CNAME record pointing to: `YOUR_USERNAME.github.io`

3. In GitHub Pages settings, enter your custom domain and save

## Troubleshooting

### Site Not Loading

- Wait 5-10 minutes after first deployment
- Check that the repository is public
- Verify the main branch exists
- Clear your browser cache

### Location Permission Not Working

- GitHub Pages automatically uses HTTPS ✅
- Make sure you're not using HTTP
- Check browser location permissions

### API Errors

- NASA Horizons API may have rate limits
- CelesTrak API is free and unlimited
- Satellite.js runs locally (no API needed)

## Performance Optimization

For better performance on GitHub Pages:

1. **Minify files** (optional):
   ```powershell
   # Install minification tools if desired
   npm install -g minify
   minify js/app.js > js/app.min.js
   ```

2. **Enable caching** - Add a `.htaccess` file (if supported)

3. **Compress images** - Optimize any images you add

## Security Notes

- API keys in `config.js` will be visible to users
- This is acceptable for free-tier APIs with rate limits
- Never store sensitive keys in client-side code
- Use environment variables for sensitive data (requires backend)

## Need Help?

- Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
- Review your browser console for JavaScript errors
- Test locally first using a local server
- Open an issue on the repository for specific problems

---

**Congratulations! Your astronomy app is now live! 🌟**
