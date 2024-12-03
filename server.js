const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const cache = new NodeCache({ stdTTL: process.env.CACHE_DURATION || 300 });

const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 1) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 5,
  message: "Too many requests, please try again later.",
});

app.use(limiter); 

morgan.token('timestamp', () => new Date().toISOString());
app.use(morgan(':timestamp :remote-addr :method :url :status :response-time ms - :res[content-length]')); 

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: No API key provided' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }

  next();
};

app.get('/api/github', authenticate, async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username query parameter is required" });
  }

  const cacheKey = `github_${username}`;
  
  if (cache.has(cacheKey)) {
    return res.json({ data: cache.get(cacheKey), cached: true });
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'GitHub-Proxy-Server' },
    });

    cache.set(cacheKey, response.data);
    res.json({ data: response.data, cached: false });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch data from GitHub API',
      details: error.message,
    });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
