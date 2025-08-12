/**
 * App.js - Main React component for the Weather Dashboard application
 * 
 * This component serves as the entry point for the application and manages:
 * - Theme switching (dark/light mode)
 * - API data fetching
 * - Error handling
 * - Layout organization of all sub-components
 */

import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastSection from './components/ForecastSection';
import HourlyForecast from './components/HourlyForecast';
import WeatherMap from './components/WeatherMap';
import WeatherNews from './components/WeatherNews';
import Footer from './components/Footer';
import { useTheme } from './context/ThemeContext';
import { FadeInUp } from './animations/FramerAnimations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Global styles that change based on the theme
const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => props.isDarkTheme 
      ? 'linear-gradient(135deg, #1e1e2f 0%, #2c2c44 100%)' 
      : 'linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%)'};
    color: ${props => props.isDarkTheme ? 'var(--text-dark)' : 'var(--text-light)'};
    min-height: 100vh;
    background-attachment: fixed;
  }
`;

// Main container for the application with responsive padding
const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

// Header component with gradient text effect
const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
  
  h1 {
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    background: ${props => props.isDarkTheme 
      ? 'linear-gradient(90deg, #80deea, #4fc3f7)' 
      : 'linear-gradient(90deg, #00897b, #0288d1)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (max-width: 600px) {
      font-size: 2rem;
    }
  }
`;

// Loading indicator with animated spinner
const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 12px;
  
  .loader {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(0, 188, 212, 0.3);
    border-radius: 50%;
    border-top-color: var(--accent);
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  p {
    margin-top: 1rem;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  }
`;

// Error message component with theme-aware styling
const Error = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${props => props.isDarkTheme ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)'};
  border-radius: 12px;
  border-left: 4px solid #f44336;
  
  h3 {
    color: #f44336;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  }
`;

/**
 * Main App component that orchestrates the entire application
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  // Theme context for dark/light mode
  const { isDarkTheme, toggleTheme } = useTheme();
  
  // State management
  const [weatherData, setWeatherData] = useState(null);  // Current weather data
  const [forecastData, setForecastData] = useState(null);  // 5-day forecast data
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  /**
   * Fetches weather and forecast data from the API
   * 
   * @param {string|null} city - City name to fetch data for
   * @param {number|null} lat - Latitude coordinate
   * @param {number|null} lon - Longitude coordinate
   */
  const fetchWeatherData = async (city = null, lat = null, lon = null) => {
    // Set loading state and clear any previous errors
    setLoading(true);
    setError(null);
    
    try {
      let weatherURL = '';
      let forecastURL = '';

      // Determine which API endpoints to use based on provided parameters
      if (city) {
        weatherURL = `/api/weather/city/${city}`;
        forecastURL = `/api/forecast/city/${city}`;
      } else {
        weatherURL = `/api/weather/coords?lat=${lat}&lon=${lon}`;
        forecastURL = `/api/forecast/coords?lat=${lat}&lon=${lon}`;
      }

      // Fetch current weather and forecast in parallel for better performance
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(weatherURL),
        axios.get(forecastURL)
      ]);

      // Update state with the fetched data
      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      
      // Show success toast notification
      if (city) {
        toast.success(`Weather data loaded for ${city}`);
      } else {
        toast.success("Weather data loaded for your location");
      }
    } catch (err) {
      // Handle errors and show error toast
      setError(err.response?.data?.message || 'Failed to fetch weather data');
      toast.error(err.response?.data?.message || 'Failed to fetch weather data');
    } finally {
      // Turn off loading state regardless of success/failure
      setLoading(false);
    }
  };

  /**
   * Handler for city search from the search bar
   * @param {string} city - City name to search for
   */
  const handleSearch = (city) => {
    if (!city) return;
    fetchWeatherData(city);
  };

  /**
   * Handler for getting weather at the user's current location
   * Uses the browser's Geolocation API
   */
  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      // Request user's location
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(null, latitude, longitude);
        },
        // Error callback
        () => {
          setError('Unable to get your location');
          toast.error('Unable to get your location');
        }
      );
    } else {
      // Browser doesn't support geolocation
      setError('Geolocation is not supported by this browser');
      toast.error('Geolocation is not supported by this browser');
    }
  };
  
  /**
   * Handler for when a location is selected on the interactive map
   * @param {number} lat - Latitude of selected location
   * @param {number} lon - Longitude of selected location
   */
  const handleMapLocationSelect = (lat, lon) => {
    fetchWeatherData(null, lat, lon);
  };

  return (
    <>
      <GlobalStyle isDarkTheme={isDarkTheme} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkTheme ? "dark" : "light"}
      />
      
      <AppContainer>
        <FadeInUp>
          <Header isDarkTheme={isDarkTheme}>
            <h1>🌤️ Mayur's Weather Dashboard</h1>
            <SearchBar 
              onSearch={handleSearch} 
              onLocationSearch={handleLocationSearch} 
            />
          </Header>
        </FadeInUp>

        {loading && (
          <Loading isDarkTheme={isDarkTheme}>
            <div className="loader"></div>
            <p>Loading weather data...</p>
          </Loading>
        )}
        
        {error && (
          <Error isDarkTheme={isDarkTheme}>
            <h3>Error</h3>
            <p>{error}</p>
          </Error>
        )}

        {weatherData && (
          <>
            <CurrentWeather data={weatherData} />
            {forecastData && (
              <>
                <ForecastSection data={forecastData} />
                <HourlyForecast data={forecastData} isDarkTheme={isDarkTheme} />
                <WeatherMap onSelectLocation={handleMapLocationSelect} />
                <WeatherNews />
              </>
            )}
          </>
        )}
      </AppContainer>
      
      <Footer toggleTheme={toggleTheme} />
    </>
  );
}

export default App;
