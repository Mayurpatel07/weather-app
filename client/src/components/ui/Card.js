import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Card container with theme awareness
export const Card = styled(motion.div)`
  background-color: ${props => props.theme === 'dark' ? 'var(--card-dark)' : 'var(--card-light)'};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme === 'dark' 
    ? '0 8px 20px rgba(0, 0, 0, 0.3)' 
    : '0 8px 20px rgba(0, 0, 0, 0.1)'};
  transition: transform 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme === 'dark' 
      ? '0 12px 30px rgba(0, 0, 0, 0.4)' 
      : '0 12px 30px rgba(0, 0, 0, 0.15)'};
  }
`;

// Glass card effect
export const GlassCard = styled(Card)`
  background-color: ${props => props.theme === 'dark' 
    ? 'rgba(42, 42, 58, 0.75)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(15px);
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.7)'};
`;

// Gradient card
export const GradientCard = styled(Card)`
  background: ${props => props.theme === 'dark'
    ? 'linear-gradient(135deg, rgba(42, 42, 58, 0.9) 0%, rgba(50, 50, 77, 0.9) 100%)'
    : 'linear-gradient(135deg, rgba(224, 247, 250, 0.9) 0%, rgba(179, 229, 252, 0.9) 100%)'};
`;

// Feature Card with Icon
export const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  min-height: 200px;
  
  .icon-container {
    background-color: ${props => props.theme === 'dark' ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)'};
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    
    svg {
      color: var(--accent);
      font-size: 1.8rem;
    }
  }
  
  h3 {
    margin: 0;
    color: ${props => props.theme === 'dark' ? 'white' : 'var(--text-light)'};
  }
  
  p {
    margin: 0;
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  }
`;

// Animated Card component
export const AnimatedCard = ({ children, variant = 'default', theme = 'light', ...props }) => {
  let CardComponent;
  
  switch (variant) {
    case 'glass':
      CardComponent = GlassCard;
      break;
    case 'gradient':
      CardComponent = GradientCard;
      break;
    case 'feature':
      CardComponent = FeatureCard;
      break;
    default:
      CardComponent = Card;
  }
  
  return (
    <CardComponent
      theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </CardComponent>
  );
};
