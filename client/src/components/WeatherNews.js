import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FadeInUp, SlideInLeft, SlideInRight } from '../animations/FramerAnimations';
import { GlassCard } from './ui/Card';
import { AnimatedButton } from './ui/Button';
import { FaBell, FaNewspaper, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const NewsContainer = styled(motion.section)`
  margin: 3rem 0;
`;

const NewsTitle = styled.h2`
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

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ArticleCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .article-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .article-title {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    font-weight: 600;
  }
  
  .article-description {
    flex: 1;
    margin-bottom: 1rem;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  .article-source {
    font-size: 0.85rem;
    display: flex;
    justify-content: space-between;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
    border-top: 1px solid ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    padding-top: 0.8rem;
  }
`;

const AlertCard = styled(GlassCard)`
  border-left: 4px solid ${props => {
    switch(props.severity) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return 'var(--accent)';
    }
  }};
  margin-bottom: 1rem;
  
  .alert-header {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 0.8rem;
    
    .alert-icon {
      color: ${props => {
        switch(props.severity) {
          case 'high':
            return '#f44336';
          case 'medium':
            return '#ff9800';
          case 'low':
            return '#4caf50';
          default:
            return 'var(--accent)';
        }
      }};
      font-size: 1.3rem;
    }
    
    .alert-title {
      font-weight: 600;
      font-size: 1.1rem;
      margin: 0;
    }
  }
  
  .alert-description {
    margin-bottom: 0.8rem;
    line-height: 1.5;
  }
  
  .alert-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  
  .empty-icon {
    font-size: 3rem;
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    margin-bottom: 1rem;
  }
  
  .empty-text {
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
  }
`;

// Mock weather news data
const mockWeatherNews = [
  {
    id: 1,
    title: "Hurricane Season Expected to be More Active Than Normal",
    description: "Meteorologists predict an above-average hurricane season this year, with warmer ocean temperatures contributing to more frequent and intense storms.",
    imageUrl: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Weather Channel",
    date: "August 5, 2025"
  },
  {
    id: 2,
    title: "Record-Breaking Heat Wave Sweeps Across Europe",
    description: "Several European countries are experiencing unprecedented high temperatures, with health officials issuing warnings about heat-related illnesses.",
    imageUrl: "https://images.unsplash.com/photo-1561647784-2f9c43b07a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Climate News",
    date: "August 7, 2025"
  },
  {
    id: 3,
    title: "New Climate Study Shows Accelerating Global Warming Trends",
    description: "Recent research indicates that global temperatures are rising faster than previously predicted, highlighting the urgent need for climate action.",
    imageUrl: "https://images.unsplash.com/photo-1544069549-2f4cbf3bc362?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Science Daily",
    date: "July 28, 2025"
  },
  {
    id: 4,
    title: "Innovative Weather Prediction Technology Unveiled",
    description: "A new AI-powered system promises to improve weather forecasting accuracy by up to 30%, potentially saving lives during extreme weather events.",
    imageUrl: "https://images.unsplash.com/photo-1590055531615-690f6a2ee052?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Tech Innovations",
    date: "August 10, 2025"
  }
];

// Mock weather alerts data
const mockWeatherAlerts = [
  {
    id: 1,
    title: "Severe Thunderstorm Warning",
    description: "Thunderstorms capable of producing damaging winds and large hail expected in the area. Seek shelter immediately if outdoors.",
    area: "Central District",
    severity: "high",
    time: "Valid until 8:00 PM",
    date: "Today"
  },
  {
    id: 2,
    title: "Flash Flood Watch",
    description: "Heavy rainfall may lead to flash flooding in low-lying areas. Avoid driving through flooded roadways.",
    area: "Eastern Region",
    severity: "medium",
    time: "Valid for next 12 hours",
    date: "Today"
  },
  {
    id: 3,
    title: "Air Quality Advisory",
    description: "Elevated levels of air pollution expected. Sensitive groups should limit outdoor activities.",
    area: "Metropolitan Area",
    severity: "low",
    time: "Valid until tomorrow morning",
    date: "Today"
  }
];

const WeatherNews = () => {
  const { isDarkTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulate fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setNews(mockWeatherNews);
      setAlerts(mockWeatherAlerts);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <NewsContainer>
      <FadeInUp>
        <TitleContainer>
          <NewsTitle>Weather News & Alerts</NewsTitle>
          <p>Stay informed with the latest weather updates and alerts</p>
        </TitleContainer>
      </FadeInUp>
      
      <TabsContainer>
        <AnimatedButton 
          variant={activeTab === 'news' ? 'primary' : 'secondary'}
          theme={isDarkTheme ? 'dark' : 'light'}
          onClick={() => setActiveTab('news')}
        >
          <FaNewspaper /> Weather News
        </AnimatedButton>
        
        <AnimatedButton 
          variant={activeTab === 'alerts' ? 'primary' : 'secondary'}
          theme={isDarkTheme ? 'dark' : 'light'}
          onClick={() => setActiveTab('alerts')}
        >
          <FaBell /> Weather Alerts {alerts.length > 0 && `(${alerts.length})`}
        </AnimatedButton>
      </TabsContainer>
      
      {activeTab === 'news' ? (
        loading ? (
          <GlassCard theme={isDarkTheme ? 'dark' : 'light'}>
            <EmptyState isDarkTheme={isDarkTheme}>
              <div className="empty-icon">
                <FaInfoCircle />
              </div>
              <p className="empty-text">Loading weather news...</p>
            </EmptyState>
          </GlassCard>
        ) : news.length > 0 ? (
          <ArticlesGrid>
            {news.map((article, index) => (
              <SlideInLeft key={article.id} delay={index * 0.1}>
                <ArticleCard theme={isDarkTheme ? 'dark' : 'light'} isDarkTheme={isDarkTheme}>
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="article-image" 
                  />
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-description">{article.description}</p>
                  <div className="article-source">
                    <span>{article.source}</span>
                    <span>{article.date}</span>
                  </div>
                </ArticleCard>
              </SlideInLeft>
            ))}
          </ArticlesGrid>
        ) : (
          <GlassCard theme={isDarkTheme ? 'dark' : 'light'}>
            <EmptyState isDarkTheme={isDarkTheme}>
              <div className="empty-icon">
                <FaNewspaper />
              </div>
              <p className="empty-text">No weather news available at the moment.</p>
            </EmptyState>
          </GlassCard>
        )
      ) : (
        loading ? (
          <GlassCard theme={isDarkTheme ? 'dark' : 'light'}>
            <EmptyState isDarkTheme={isDarkTheme}>
              <div className="empty-icon">
                <FaInfoCircle />
              </div>
              <p className="empty-text">Loading weather alerts...</p>
            </EmptyState>
          </GlassCard>
        ) : alerts.length > 0 ? (
          <div>
            {alerts.map((alert, index) => (
              <SlideInRight key={alert.id} delay={index * 0.1}>
                <AlertCard 
                  theme={isDarkTheme ? 'dark' : 'light'} 
                  isDarkTheme={isDarkTheme}
                  severity={alert.severity}
                >
                  <div className="alert-header">
                    <span className="alert-icon">
                      <FaExclamationTriangle />
                    </span>
                    <h3 className="alert-title">{alert.title}</h3>
                  </div>
                  <p className="alert-description">{alert.description}</p>
                  <div className="alert-meta">
                    <span>{alert.area}</span>
                    <span>{alert.time}</span>
                  </div>
                </AlertCard>
              </SlideInRight>
            ))}
          </div>
        ) : (
          <GlassCard theme={isDarkTheme ? 'dark' : 'light'}>
            <EmptyState isDarkTheme={isDarkTheme}>
              <div className="empty-icon">
                <FaBell />
              </div>
              <p className="empty-text">No active weather alerts for your area.</p>
            </EmptyState>
          </GlassCard>
        )
      )}
    </NewsContainer>
  );
};

export default WeatherNews;
