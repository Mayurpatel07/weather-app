/**
 * WeatherMap.js - Interactive map component for the Weather Dashboard
 * 
 * This component uses react-leaflet to create an interactive map that:
 * - Allows users to click anywhere on the map to get weather data for that location
 * - Provides multiple map layer options (streets, dark, satellite, topographic)
 * - Shows markers for selected locations
 * - Uses smooth animations and glass-like card styling
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { GlassCard } from './ui/Card';
import { AnimatedButton } from './ui/Button';
import { FaMapMarkedAlt, FaLayerGroup, FaCloud, FaTemperatureHigh, FaWind } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { FadeInUp } from '../animations/FramerAnimations';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons - necessary because of how Leaflet handles icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Styled components for the map section
const MapSection = styled(motion.section)`
  margin: 3rem 0;
`;

// Title with underline effect using pseudo-element
const MapTitle = styled.h2`
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

// Map container with glass-like effect
const MapWrapper = styled(GlassCard)`
  height: 500px;
  width: 100%;
  overflow: hidden;
  padding: 0;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
    z-index: 1;
  }
`;

const MapControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MapInstructions = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-style: italic;
  opacity: 0.8;
`;

/**
 * LocationMarker - Handles map click events and places markers
 * 
 * This component is used within the map to:
 * - Listen for click events on the map
 * - Update the marker position when the user clicks
 * - Trigger the callback to fetch weather data for the selected location
 */
const LocationMarker = ({ position, setPosition, onSelectLocation }) => {
  // useMapEvents is a hook from react-leaflet that allows us to listen for map events
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelectLocation(e.latlng);
    }
  });

  // Only render the marker if a position exists
  return position === null ? null : (
    <Marker position={position}>
      <Popup>You clicked here</Popup>
    </Marker>
  );
};

/**
 * WeatherMap - Main component for the interactive map
 * 
 * @param {function} onSelectLocation - Callback function that takes lat, lon coordinates
 *                                      when a user selects a location on the map
 */
const WeatherMap = ({ onSelectLocation }) => {
  // Access theme context for dark/light mode
  const { isDarkTheme } = useTheme();
  
  // State management
  const [position, setPosition] = useState(null);  // Selected position on the map
  const [mapType, setMapType] = useState('streets');  // Current map layer
  
  // Default location (world center) and zoom level
  const defaultPosition = [20, 0];
  const defaultZoom = 2;
  
  // Different map layer URLs for the various map styles
  const mapLayers = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  };
  
  /**
   * Handler for when user clicks a location on the map
   * Extracts latitude and longitude and passes them to the parent component
   */
  const handleSelectLocation = (location) => {
    if (onSelectLocation) {
      onSelectLocation(location.lat, location.lng);
    }
  };
  
  return (
    <MapSection>
      {/* Title section with fade-in animation */}
      <FadeInUp>
        <TitleContainer>
          <MapTitle>Interactive Weather Map</MapTitle>
          <p>Click anywhere on the map to check the weather there</p>
        </TitleContainer>
      </FadeInUp>
      
      {/* Map type selector buttons */}
      <MapControls>
        {/* Streets map layer button - active state depends on current selection */}
        <AnimatedButton 
          variant={mapType === 'streets' ? 'primary' : 'secondary'}
          theme={isDarkTheme ? 'dark' : 'light'}
          onClick={() => setMapType('streets')}
        >
          <FaMapMarkedAlt /> Streets
        </AnimatedButton>
        
        {/* Dark map layer button */}
        <AnimatedButton 
          variant={mapType === 'dark' ? 'primary' : 'secondary'}
          theme={isDarkTheme ? 'dark' : 'light'}
          onClick={() => setMapType('dark')}
        >
          <FaLayerGroup /> Dark
        </AnimatedButton>
        
        {/* Satellite map layer button */}
        <AnimatedButton 
          variant={mapType === 'satellite' ? 'primary' : 'secondary'}
          theme={isDarkTheme ? 'dark' : 'light'}
          onClick={() => setMapType('satellite')}
        >
          <FaCloud /> Satellite
        </AnimatedButton>
        
        {/* Topographic map layer button */}
        <AnimatedButton 
          variant={mapType === 'topo' ? 'primary' : 'secondary'}
          theme={isDarkTheme ? 'dark' : 'light'}
          onClick={() => setMapType('topo')}
        >
          <FaTemperatureHigh /> Topographic
        </AnimatedButton>
      </MapControls>
      
      {/* Main map container with glass effect */}
      <MapWrapper theme={isDarkTheme ? 'dark' : 'light'}>
        {/* Leaflet map component - core map functionality */}
        <LeafletMapContainer 
          center={defaultPosition} 
          zoom={defaultZoom} 
          scrollWheelZoom={true}
        >
          {/* Map tile layer - changes based on selected map type */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={mapLayers[mapType]}
          />
          {/* Interactive marker component that handles map clicks */}
          <LocationMarker 
            position={position} 
            setPosition={setPosition} 
            onSelectLocation={handleSelectLocation}
          />
        </LeafletMapContainer>
      </MapWrapper>
      
      {/* User instructions */}
      <MapInstructions>
        Tip: Click on any location to fetch the weather data for that specific point on the map.
      </MapInstructions>
    </MapSection>
  );
};

export default WeatherMap;
