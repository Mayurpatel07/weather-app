/**
 * Server.js - Main Express server for the Weather App
 * 
 * This file sets up an Express server that acts as a middleware between
 * the React frontend and the OpenWeatherMap API. It handles all API calls,
 * provides rate limiting, and serves the React app in production.
 */

// Import required modules
const express = require('express');  // Web server framework
const cors = require('cors');        // Enable Cross-Origin Resource Sharing
const axios = require('axios');      // HTTP client for API requests
const rateLimit = require('express-rate-limit');  // Prevents API abuse
const path = require('path');        // File path utilities
require('dotenv').config();          // Load environment variables from .env file

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;  // Use environment port or default to 5000
const API_KEY = process.env.API_KEY;    // OpenWeatherMap API key from environment variables

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse JSON request bodies

// Rate limiting configuration
// This prevents abuse by limiting how many requests a single IP can make
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all requests
app.use(limiter);

// API Routes

/**
 * GET /api/weather/city/:city
 * 
 * Route to get current weather data for a specific city
 * @param {string} city - The name of the city to get weather for
 * @returns {Object} - Weather data for the specified city
 */
app.get('/api/weather/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    // Make request to OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    // Return the data to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors and send appropriate status code
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Something went wrong',
    });
  }
});

/**
 * GET /api/weather/coords
 * 
 * Route to get current weather data based on latitude and longitude
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @returns {Object} - Weather data for the specified coordinates
 */
app.get('/api/weather/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Validate that required parameters are provided
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Make request to OpenWeatherMap API with coordinates
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    // Handle errors
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Something went wrong',
    });
  }
});

/**
 * GET /api/forecast/city/:city
 * 
 * Route to get 5-day forecast data for a specific city
 * @param {string} city - The name of the city to get forecast for
 * @returns {Object} - Forecast data with 3-hour intervals for 5 days
 */
app.get('/api/forecast/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    // Request forecast data from OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Something went wrong',
    });
  }
});

/**
 * GET /api/forecast/coords
 * 
 * Route to get 5-day forecast data based on latitude and longitude
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @returns {Object} - Forecast data with 3-hour intervals for 5 days
 */
app.get('/api/forecast/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Validate that required parameters are provided
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Request forecast data from OpenWeatherMap API using coordinates
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Something went wrong',
    });
  }
});

// Production setup
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../client/build')));

  // The "catchall" handler: for any request that doesn't match a defined route,
  // send back React's index.html file (enables client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
