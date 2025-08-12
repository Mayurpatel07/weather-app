import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { GlassCard } from './ui/Card';
import { Floating, Pulsing } from '../animations/AnimatedIcons';
import { FaTemperatureHigh, FaWind, FaCompass, FaTint, FaCloudRain, FaEye, 
         FaArrowUp, FaArrowDown, FaCloudSun, FaSun, FaCloud } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const WeatherContainer = styled(motion.div)`
  margin: 2rem 0;
`;

const MainInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LocationInfo = styled.div`
  h2 {
    font-size: 2.2rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .date-time {
    margin: 0.5rem 0 1.5rem;
    font-size: 1.1rem;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  }
`;

const CurrentConditions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .temp-container {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .current-temp {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0;
  }
  
  .feels-like {
    margin: 0;
    font-size: 1rem;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  }
  
  .weather-icon {
    width: 120px;
    height: 120px;
    margin-bottom: -1rem;
  }
  
  .weather-description {
    text-transform: capitalize;
    font-size: 1.3rem;
    margin: 0;
  }
`;

const HighlightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const HighlightCard = styled(GlassCard)`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  h3 {
    margin: 0 0 0.8rem;
    font-size: 1rem;
    font-weight: 500;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .highlight-value {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }
  
  .highlight-unit {
    font-size: 0.9rem;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
  }
  
  .icon-container {
    font-size: 1.5rem;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }
`;

const MinMaxContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
  
  .min-max {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
    
    svg {
      color: ${props => props.theme === 'min' ? '#00bcd4' : '#ff5722'};
    }
  }
`;

// Function to get appropriate weather icon component
const getWeatherIcon = (weatherCondition) => {
  switch (weatherCondition.toLowerCase()) {
    case 'clear':
      return <FaSun />;
    case 'clouds':
      return <FaCloud />;
    case 'rain':
    case 'drizzle':
      return <FaCloudRain />;
    case 'mist':
    case 'fog':
      return <FaCloudSun />;
    default:
      return <FaCloudSun />;
  }
};

const CurrentWeather = ({ data }) => {
  const { name, weather, main, wind, sys, visibility, clouds } = data;
  const { isDarkTheme } = useTheme();
  const currentDate = new Date();
  
  // Format the current date and time
  const dateTimeString = format(currentDate, 'EEEE, MMMM do, yyyy • h:mm a');
  
  // Calculate sunrise and sunset times
  const sunrise = new Date(sys.sunrise * 1000);
  const sunset = new Date(sys.sunset * 1000);
  const sunriseTime = format(sunrise, 'h:mm a');
  const sunsetTime = format(sunset, 'h:mm a');
  
  // Format visibility (convert from meters to kilometers)
  const visibilityKm = (visibility / 1000).toFixed(1);
  
  return (
    <WeatherContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <GlassCard theme={isDarkTheme ? 'dark' : 'light'}>
        <MainInfoContainer>
          <LocationInfo isDarkTheme={isDarkTheme}>
            <h2>
              {name}, {sys.country}
            </h2>
            <p className="date-time">{dateTimeString}</p>
            
            <MinMaxContainer isDarkTheme={isDarkTheme}>
              <div className="min-max" theme="min">
                <FaArrowDown /> {Math.round(main.temp_min)}°C
              </div>
              <div className="min-max" theme="max">
                <FaArrowUp /> {Math.round(main.temp_max)}°C
              </div>
            </MinMaxContainer>
          </LocationInfo>
          
          <CurrentConditions isDarkTheme={isDarkTheme}>
            <Floating>
              <img 
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`}
                alt={weather[0].description}
              />
            </Floating>
            
            <div className="temp-container">
              <Pulsing>
                <p className="current-temp">{Math.round(main.temp)}°C</p>
              </Pulsing>
            </div>
            
            <p className="feels-like">Feels like {Math.round(main.feels_like)}°C</p>
            <p className="weather-description">{weather[0].description}</p>
          </CurrentConditions>
        </MainInfoContainer>
        
        <HighlightGrid>
          <HighlightCard theme={isDarkTheme ? 'dark' : 'light'} isDarkTheme={isDarkTheme}>
            <div className="icon-container">
              <FaWind />
            </div>
            <h3>Wind Speed</h3>
            <p className="highlight-value">{wind.speed}</p>
            <p className="highlight-unit">m/s</p>
          </HighlightCard>
          
          <HighlightCard theme={isDarkTheme ? 'dark' : 'light'} isDarkTheme={isDarkTheme}>
            <div className="icon-container">
              <FaCompass />
            </div>
            <h3>Wind Direction</h3>
            <p className="highlight-value">{wind.deg}°</p>
            <p className="highlight-unit">degrees</p>
          </HighlightCard>
          
          <HighlightCard theme={isDarkTheme ? 'dark' : 'light'} isDarkTheme={isDarkTheme}>
            <div className="icon-container">
              <FaTint />
            </div>
            <h3>Humidity</h3>
            <p className="highlight-value">{main.humidity}</p>
            <p className="highlight-unit">%</p>
          </HighlightCard>
          
          <HighlightCard theme={isDarkTheme ? 'dark' : 'light'} isDarkTheme={isDarkTheme}>
            <div className="icon-container">
              <FaTemperatureHigh />
            </div>
            <h3>Pressure</h3>
            <p className="highlight-value">{main.pressure}</p>
            <p className="highlight-unit">hPa</p>
          </HighlightCard>
          
          <HighlightCard theme={isDarkTheme ? 'dark' : 'light'} isDarkTheme={isDarkTheme}>
            <div className="icon-container">
              <FaEye />
            </div>
            <h3>Visibility</h3>
            <p className="highlight-value">{visibilityKm}</p>
            <p className="highlight-unit">km</p>
          </HighlightCard>
          
          <HighlightCard theme={isDarkTheme ? 'dark' : 'light'} isDarkTheme={isDarkTheme}>
            <div className="icon-container">
              <FaCloud />
            </div>
            <h3>Cloudiness</h3>
            <p className="highlight-value">{clouds.all}</p>
            <p className="highlight-unit">%</p>
          </HighlightCard>
        </HighlightGrid>
      </GlassCard>
    </WeatherContainer>
  );
};

export default CurrentWeather;
