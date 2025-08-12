import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Base button styling
const BaseButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// Primary button variant
export const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(135deg, var(--accent) 0%, #0097a7 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 188, 212, 0.3);
  
  &:hover {
    box-shadow: 0 6px 15px rgba(0, 188, 212, 0.4);
  }
`;

// Secondary button variant
export const SecondaryButton = styled(BaseButton)`
  background: ${props => props.theme === 'dark' ? '#2c2c44' : '#e1f5fe'};
  color: ${props => props.theme === 'dark' ? 'white' : 'var(--accent)'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Icon button variant
export const IconButton = styled(BaseButton)`
  padding: 0.6rem;
  border-radius: 50%;
  background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.theme === 'dark' ? 'white' : 'var(--text-light)'};
  
  &:hover {
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

// Animated button component that combines framer-motion with styled components
export const AnimatedButton = ({ children, variant = 'primary', theme = 'light', ...props }) => {
  let ButtonComponent;
  
  switch (variant) {
    case 'secondary':
      ButtonComponent = SecondaryButton;
      break;
    case 'icon':
      ButtonComponent = IconButton;
      break;
    default:
      ButtonComponent = PrimaryButton;
  }
  
  return (
    <ButtonComponent
      theme={theme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </ButtonComponent>
  );
};
