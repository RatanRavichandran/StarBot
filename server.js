// StarBot Backend Server - CORS Proxy for NASA Horizons, OpenAI, and SerpAPI
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

console.log('🚀 StarBot Backend Server Starting...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'StarBot Backend Server is running',
        timestamp: new Date().toISOString()
    });
});

// NASA Horizons API Proxy
app.get('/api/horizons', async (req, res) => {
    try {
        const queryParams = new URLSearchParams(req.query);
        const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${queryParams}`;
        
        console.log(`📡 Proxying Horizons request for body: ${req.query.COMMAND || 'unknown'}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Horizons API error: ${response.status}`);
        }
        
        res.json(data);
    } catch (error) {
        console.error('❌ Horizons API Error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch from Horizons API',
            message: error.message 
        });
    }
});

// SerpAPI Proxy
app.get('/api/serp', async (req, res) => {
    try {
        const { q, num = 3 } = req.query;
        
        if (!process.env.SERPAPI_KEY) {
            throw new Error('SERPAPI_KEY not configured');
        }
        
        const url = `https://serpapi.com/search?q=${encodeURIComponent(q)}&api_key=${process.env.SERPAPI_KEY}&num=${num}`;
        
        console.log(`🔍 Proxying SerpAPI search: "${q}"`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`SerpAPI error: ${response.status}`);
        }
        
        res.json(data);
    } catch (error) {
        console.error('❌ SerpAPI Error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch from SerpAPI',
            message: error.message 
        });
    }
});

// OpenAI API Proxy
app.post('/api/openai', async (req, res) => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY not configured');
        }
        
        console.log('🤖 Proxying OpenAI request');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
        }
        
        res.json(data);
    } catch (error) {
        console.error('❌ OpenAI API Error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch from OpenAI API',
            message: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 Available endpoints:');
    console.log(`   • http://localhost:${PORT} - Frontend application`);
    console.log(`   • http://localhost:${PORT}/api/health - Health check`);
    console.log(`   • http://localhost:${PORT}/api/horizons - NASA Horizons proxy`);
    console.log(`   • http://localhost:${PORT}/api/serp - SerpAPI proxy`);
    console.log(`   • http://localhost:${PORT}/api/openai - OpenAI proxy`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Access the app at: http://localhost:' + PORT);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
