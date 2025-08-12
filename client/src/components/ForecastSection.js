import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { FaTemperatureHigh, FaTemperatureLow, FaTint, FaWind, FaCloud } from 'react-icons/fa';
import { GlassCard } from './ui/Card';
import { useTheme } from '../context/ThemeContext';
import { FadeInUp } from '../animations/FramerAnimations';
import { Floating } from '../animations/AnimatedIcons';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const ForecastContainer = styled(motion.section)`
  margin: 3rem 0;
`;

const ForecastTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
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
  margin-bottom: 2rem;
`;

const ForecastCard = styled(GlassCard)`
  height: 100%;
  padding: 1.2rem;
  margin: 0.5rem;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-8px);
  }
`;

const ForecastDay = styled.h3`
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  border-bottom: 1px solid ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  padding-bottom: 8px;
`;

const WeatherIcon = styled.div`
  text-align: center;
  margin: 0.5rem 0;
  
  img {
    width: 70px;
    height: 70px;
  }
`;

const WeatherDescription = styled.p`
  text-transform: capitalize;
  margin: 0.5rem 0 1rem;
  font-size: 1rem;
`;

const ForecastDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  
  svg {
    color: var(--accent);
  }
`;

const ForecastSection = ({ data }) => {
  const { isDarkTheme } = useTheme();
  
  // Filter data to get one forecast per day at noon
  const dailyForecast = data.list.filter(item => 
    item.dt_txt.includes("12:00:00")
  );
  
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  return (
    <ForecastContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <FadeInUp>
        <TitleContainer>
          <ForecastTitle>5-Day Forecast</ForecastTitle>
        </TitleContainer>
      </FadeInUp>
      
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        modules={[FreeMode, Pagination]}
      >
        {dailyForecast.map((day, index) => {
          const date = new Date(day.dt_txt);
          const dayOfWeek = format(date, 'EEEE');
          const formattedDate = format(date, 'MMM d');

          return (
            <SwiperSlide key={index}>
              <ForecastCard 
                theme={isDarkTheme ? 'dark' : 'light'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ForecastDay isDarkTheme={isDarkTheme}>
                  {dayOfWeek}
                  <br />
                  <small>{formattedDate}</small>
                </ForecastDay>
                
                <Floating>
                  <WeatherIcon>
                    <img 
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                    />
                  </WeatherIcon>
                </Floating>
                
                <WeatherDescription>{day.weather[0].description}</WeatherDescription>
                
                <ForecastDetail>
                  <FaTemperatureHigh />
                  <span>High: {Math.round(day.main.temp_max)}°C</span>
                </ForecastDetail>
                
                <ForecastDetail>
                  <FaTemperatureLow />
                  <span>Low: {Math.round(day.main.temp_min)}°C</span>
                </ForecastDetail>
                
                <ForecastDetail>
                  <FaTint />
                  <span>Humidity: {day.main.humidity}%</span>
                </ForecastDetail>
                
                <ForecastDetail>
                  <FaWind />
                  <span>Wind: {day.wind.speed} m/s</span>
                </ForecastDetail>
                
                <ForecastDetail>
                  <FaCloud />
                  <span>Clouds: {day.clouds.all}%</span>
                </ForecastDetail>
              </ForecastCard>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </ForecastContainer>
  );
};

export default ForecastSection;
