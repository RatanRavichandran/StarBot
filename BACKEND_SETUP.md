# StarBot Backend Server Setup

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start the Server
```powershell
npm start
```

The server will start on **http://localhost:3001** and serve both the backend API and the frontend application.

### 3. Access the Application
Open your browser to: **http://localhost:3001**

---

## 📡 API Endpoints

The backend server provides the following proxy endpoints:

### Health Check
- **GET** `/api/health` - Check if the server is running

### NASA Horizons API Proxy
- **GET** `/api/horizons?[query params]` - Proxies requests to NASA Horizons API
- Solves CORS issues for real-time celestial body positions

### SerpAPI Proxy  
- **GET** `/api/serp?q=[search query]&num=[results]` - Proxies web search requests
- Used for gathering context for AI fact generation

### OpenAI API Proxy
- **POST** `/api/openai` - Proxies OpenAI chat completions requests
- Body: Same format as OpenAI API (model, messages, etc.)
- Solves CORS issues for AI-powered fact generation

---

## 🔐 Security

- API keys are stored in `.env` file (never committed to git)
- `.env` is in `.gitignore` to prevent accidental exposure
- Backend handles all authentication with external APIs

---

## 🛠️ Development Mode

For auto-restart on file changes:
```powershell
npm run dev
```

---

## ✨ Features Enabled by Backend

### 1. **Real-Time Celestial Positions**
- Queries NASA Horizons API for live positions of dwarf planets and asteroids
- Calculates exact altitude, azimuth, and distance from zenith
- Shows only bodies currently above the horizon from Bangalore

### 2. **AI-Powered Facts**
- Uses SerpAPI to search for context about objects
- Generates personalized 2-line facts with OpenAI GPT-4o-mini
- Mentions Bangalore viewing conditions when relevant
- Caches results to minimize API calls

### 3. **No CORS Errors**
- All external API calls go through the backend proxy
- Browser never directly calls NASA, SerpAPI, or OpenAI
- Clean console with zero CORS errors

---

## 📝 Configuration

Edit `js/config.js` to toggle backend usage:

```javascript
USE_BACKEND: true,  // Set to false to use direct API calls (will have CORS issues)
BACKEND_URL: 'http://localhost:3001/api'
```

---

## 🐛 Troubleshooting

### Server won't start
- Make sure `.env` file exists with your API keys
- Check if port 3001 is available
- Run `npm install` to ensure dependencies are installed

### API calls failing
- Check `.env` file has valid API keys
- Verify OpenAI API key is not expired
- Check SerpAPI monthly quota (100 searches/month on free tier)

### Frontend not loading
- Make sure you're accessing `http://localhost:3001` (not 8000)
- Check browser console for errors
- Verify `USE_BACKEND: true` in `js/config.js`

---

## 📦 Dependencies

- **express** - Web server framework
- **cors** - Enable CORS for all routes
- **dotenv** - Load environment variables from `.env`
- **node-fetch** - Make HTTP requests to external APIs
- **nodemon** (dev) - Auto-restart server on changes

---

## 🌟 What's Different from Static Version?

| Feature | Static Version | Backend Version |
|---------|---------------|-----------------|
| **Celestial Positions** | Fixed fallback data | Real-time from NASA Horizons |
| **Facts** | Generic static facts | AI-generated personalized facts |
| **CORS Issues** | Many errors in console | Zero errors |
| **API Keys** | Exposed in frontend code | Secure in backend .env |
| **Data Freshness** | Never updates | Updates every scan |

---

## 🎯 Next Steps

1. Run `npm install`
2. Verify `.env` has your API keys
3. Run `npm start`
4. Open http://localhost:3001
5. Click "Detect My Location"
6. Watch the magic! ✨

Celestial bodies will now show **real positions** and **AI-generated facts** personalized to Bangalore! 🌍🔭
