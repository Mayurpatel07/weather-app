import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { AnimatedButton } from './ui/Button';
import { useTheme } from '../context/ThemeContext';

const FooterContainer = styled(motion.footer)`
  margin-top: 4rem;
  position: relative;
  overflow: hidden;
`;

const FooterWave = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
  
  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 70px;
    transform: rotateY(180deg);
  }
  
  .shape-fill {
    fill: var(--accent);
  }
`;

const FooterContent = styled.div`
  background: linear-gradient(135deg, #00acc1 0%, #006064 100%);
  color: white;
  padding: 6rem 2rem 2rem;
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
    padding-bottom: 8px;
    
    &:after {
      content: '';
      position: absolute;
      width: 40%;
      height: 2px;
      background: rgba(255, 255, 255, 0.7);
      bottom: 0;
      left: 0;
      border-radius: 2px;
    }
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-3px);
    }
  }
`;

const ThemeToggleSection = styled.div`
  text-align: center;
  padding: 1rem 0;
  background: rgba(0, 0, 0, 0.1);
  
  p {
    margin-bottom: 1rem;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
`;

const Footer = ({ toggleTheme }) => {
  const { isDarkTheme } = useTheme();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <FooterWave>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </FooterWave>
      
      <FooterContent>
        <div className="container">
          <FooterSection>
            <h3>About This App</h3>
            <p>
              Mayur's Weather Dashboard provides real-time weather information, forecasts, 
              and detailed meteorological data for locations worldwide. Built with React 
              and powered by OpenWeatherMap API.
            </p>
          </FooterSection>
          
          <FooterSection>
            <h3>Features</h3>
            <ul>
              <li>Current weather conditions</li>
              <li>5-day weather forecast</li>
              <li>Hourly temperature charts</li>
              <li>Location-based weather</li>
              <li>Interactive data visualization</li>
              <li>Light/Dark theme support</li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h3>Connect With Me</h3>
            <p>
              Have questions or suggestions? Feel free to reach out on 
              social media or via email.
            </p>
            <SocialIcons>
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a 
                href="mailto:example@example.com" 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaEnvelope size={20} />
              </motion.a>
            </SocialIcons>
          </FooterSection>
        </div>
      </FooterContent>
      
      <ThemeToggleSection>
        <p>Choose your preferred theme</p>
        <AnimatedButton 
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkTheme ? <FaSun size={16} /> : <FaMoon size={16} />}
          {isDarkTheme ? ' Switch to Light Mode' : ' Switch to Dark Mode'}
        </AnimatedButton>
      </ThemeToggleSection>
      
      <Copyright>
        <p>Designed & Developed by Mayur Patel © {currentYear}</p>
        <p>Powered by OpenWeatherMap API</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
