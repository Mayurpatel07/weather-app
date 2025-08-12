import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const FloatingIcon = styled.div`
  animation: ${float} 3s ease-in-out infinite;
  display: inline-block;
`;

const RotatingIcon = styled.div`
  animation: ${rotate} 5s linear infinite;
  display: inline-block;
`;

const PulsingIcon = styled.div`
  animation: ${pulse} 2s ease-in-out infinite;
  display: inline-block;
`;

// Animation wrapper components
export const Floating = ({ children }) => {
  return <FloatingIcon>{children}</FloatingIcon>;
};

export const Rotating = ({ children }) => {
  return <RotatingIcon>{children}</RotatingIcon>;
};

export const Pulsing = ({ children }) => {
  return <PulsingIcon>{children}</PulsingIcon>;
};
