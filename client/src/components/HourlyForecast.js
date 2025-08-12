import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { FadeInUp } from '../animations/FramerAnimations';
import { GlassCard } from './ui/Card';
import { AnimatedButton } from './ui/Button';
import { FaChartLine, FaChartBar, FaTemperatureHigh, FaTint, FaWind, FaCloud } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HourlyContainer = styled(motion.section)`
  margin: 3rem 0;
`;

const HourlyTitle = styled.h2`
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  
  &:after {
    content: '';
    position: absolute;
    width: 40%;
    height: 3px;
    background: var(--accent);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ChartContainer = styled.div`
  height: 350px;
  position: relative;
  margin-top: 1.5rem;
`;

const ChartOptionsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const ChartMetricSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const HourlyDetailCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const HourlyDetailCard = styled(GlassCard)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .time {
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  .detail-icon {
    margin: 0.5rem 0;
    
    img {
      width: 50px;
      height: 50px;
    }
  }
  
  .weather-desc {
    text-transform: capitalize;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.3rem 0;
    font-size: 0.9rem;
    
    svg {
      color: var(--accent);
    }
  }
`;

const HourlyForecast = ({ data, isDarkTheme }) => {
  const [chartType, setChartType] = useState('line');
  const [activeMetric, setActiveMetric] = useState('temperature');
  
  // Get the next 24 hours of forecast (8 intervals of 3 hours)
  const hourlyData = data.list.slice(0, 8);
  
  // Format the hours for display
  const hours = hourlyData.map(item => {
    const date = new Date(item.dt_txt);
    return format(date, 'h:mm a');
  });
  
  // Get the temperatures
  const temperatures = hourlyData.map(item => Math.round(item.main.temp));
  
  // Get the humidity
  const humidity = hourlyData.map(item => item.main.humidity);
  
  // Get the wind speed
  const windSpeed = hourlyData.map(item => item.wind.speed);
  
  // Get the clouds percentage
  const cloudiness = hourlyData.map(item => item.clouds.all);
  
  // Define chart data based on active metric
  const getChartData = () => {
    let datasets = [];
    
    if (activeMetric === 'temperature') {
      datasets = [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          fill: true,
          tension: 0.4,
        }
      ];
    } else if (activeMetric === 'humidity') {
      datasets = [
        {
          label: 'Humidity (%)',
          data: humidity,
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          fill: true,
          tension: 0.4,
        }
      ];
    } else if (activeMetric === 'wind') {
      datasets = [
        {
          label: 'Wind Speed (m/s)',
          data: windSpeed,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.4,
        }
      ];
    } else if (activeMetric === 'clouds') {
      datasets = [
        {
          label: 'Cloudiness (%)',
          data: cloudiness,
          borderColor: '#9c27b0',
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          fill: true,
          tension: 0.4,
        }
      ];
    } else if (activeMetric === 'all') {
      datasets = [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Humidity (%)',
          data: humidity,
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        },
        {
          label: 'Wind Speed (m/s)',
          data: windSpeed,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y2',
        }
      ];
    }
    
    return {
      labels: hours,
      datasets
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkTheme ? '#f5f5f5' : '#222',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkTheme ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkTheme ? '#fff' : '#000',
        bodyColor: isDarkTheme ? '#fff' : '#000',
        borderColor: 'rgba(0, 188, 212, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: isDarkTheme ? '#f5f5f5' : '#222',
          font: {
            size: 10
          }
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: activeMetric === 'temperature' || activeMetric === 'all',
          text: 'Temperature (°C)',
          color: isDarkTheme ? '#f5f5f5' : '#222'
        },
        ticks: {
          color: isDarkTheme ? '#f5f5f5' : '#222'
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y1: {
        type: 'linear',
        display: activeMetric === 'all',
        position: 'right',
        title: {
          display: activeMetric === 'humidity' || activeMetric === 'all',
          text: 'Humidity (%)',
          color: isDarkTheme ? '#f5f5f5' : '#222'
        },
        ticks: {
          color: isDarkTheme ? '#f5f5f5' : '#222'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y2: {
        type: 'linear',
        display: activeMetric === 'all',
        position: 'right',
        title: {
          display: activeMetric === 'wind' || activeMetric === 'all',
          text: 'Wind (m/s)',
          color: isDarkTheme ? '#f5f5f5' : '#222'
        },
        ticks: {
          color: isDarkTheme ? '#f5f5f5' : '#222'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };
  
  return (
    <HourlyContainer>
      <FadeInUp>
        <TitleContainer>
          <HourlyTitle>Hourly Forecast</HourlyTitle>
          <p>Next 24 hours weather prediction</p>
        </TitleContainer>
      </FadeInUp>
      
      <GlassCard theme={isDarkTheme ? 'dark' : 'light'}>
        <ChartOptionsBar>
          <AnimatedButton 
            variant={chartType === 'line' ? 'primary' : 'secondary'}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={() => setChartType('line')}
          >
            <FaChartLine /> Line Chart
          </AnimatedButton>
          
          <AnimatedButton 
            variant={chartType === 'bar' ? 'primary' : 'secondary'}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={() => setChartType('bar')}
          >
            <FaChartBar /> Bar Chart
          </AnimatedButton>
        </ChartOptionsBar>
        
        <ChartMetricSelector>
          <AnimatedButton 
            variant={activeMetric === 'temperature' ? 'primary' : 'secondary'}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={() => setActiveMetric('temperature')}
          >
            <FaTemperatureHigh /> Temperature
          </AnimatedButton>
          
          <AnimatedButton 
            variant={activeMetric === 'humidity' ? 'primary' : 'secondary'}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={() => setActiveMetric('humidity')}
          >
            <FaTint /> Humidity
          </AnimatedButton>
          
          <AnimatedButton 
            variant={activeMetric === 'wind' ? 'primary' : 'secondary'}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={() => setActiveMetric('wind')}
          >
            <FaWind /> Wind
          </AnimatedButton>
          
          <AnimatedButton 
            variant={activeMetric === 'clouds' ? 'primary' : 'secondary'}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={() => setActiveMetric('clouds')}
          >
            <FaCloud /> Clouds
          </AnimatedButton>
          
          <AnimatedButton 
            variant={activeMetric === 'all' ? 'primary' : 'secondary'}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={() => setActiveMetric('all')}
          >
            All Metrics
          </AnimatedButton>
        </ChartMetricSelector>
        
        <ChartContainer>
          {chartType === 'line' ? (
            <Line data={getChartData()} options={chartOptions} />
          ) : (
            <Line data={getChartData()} options={chartOptions} type="bar" />
          )}
        </ChartContainer>
        
        <HourlyDetailCards>
          {hourlyData.map((hour, index) => {
            const date = new Date(hour.dt_txt);
            const timeString = format(date, 'h:mm a');
            
            return (
              <HourlyDetailCard 
                key={index}
                theme={isDarkTheme ? 'dark' : 'light'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
              >
                <p className="time">{timeString}</p>
                <div className="detail-icon">
                  <img 
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
                    alt={hour.weather[0].description}
                  />
                </div>
                <p className="weather-desc">{hour.weather[0].description}</p>
                
                <div className="detail-item">
                  <FaTemperatureHigh />
                  <span>{Math.round(hour.main.temp)}°C</span>
                </div>
                
                <div className="detail-item">
                  <FaTint />
                  <span>{hour.main.humidity}%</span>
                </div>
                
                <div className="detail-item">
                  <FaWind />
                  <span>{hour.wind.speed} m/s</span>
                </div>
              </HourlyDetailCard>
            );
          })}
        </HourlyDetailCards>
      </GlassCard>
    </HourlyContainer>
  );
};

export default HourlyForecast;
