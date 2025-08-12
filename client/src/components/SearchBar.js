import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';
import { AnimatedButton } from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 0.5rem;
  width: 100%;
  
  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const SearchInput = styled.input`
  padding: 0.8rem 1rem 0.8rem 3rem;
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.isDarkTheme ? 'white' : 'var(--text-light)'};
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 4px 15px rgba(0, 188, 212, 0.25);
  }
  
  &::placeholder {
    color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const RecentSearchesContainer = styled(motion.div)`
  background-color: ${props => props.isDarkTheme ? 'rgba(42, 42, 58, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
  }
`;

const RecentSearchItem = styled.li`
  padding: 0.8rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  .icon {
    color: var(--accent);
    font-size: 0.9rem;
  }
`;

const SearchBar = ({ onSearch, onLocationSearch }) => {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const { isDarkTheme } = useTheme();
  
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentWeatherSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  const saveSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const newSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm).slice(0, 4)
    ];
    
    setRecentSearches(newSearches);
    localStorage.setItem('recentWeatherSearches', JSON.stringify(newSearches));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      saveSearch(city.trim());
      setCity('');
      setShowRecentSearches(false);
    } else {
      toast.warning('Please enter a city name');
    }
  };
  
  const handleLocationSearch = () => {
    setShowRecentSearches(false);
    onLocationSearch();
    toast.info('Getting your location...');
  };
  
  const handleRecentSearchClick = (searchTerm) => {
    onSearch(searchTerm);
    setCity('');
    setShowRecentSearches(false);
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInputWrapper>
          <SearchIcon isDarkTheme={isDarkTheme}>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setShowRecentSearches(true)}
            placeholder="Search City (e.g., Pune)"
            aria-label="City name"
            isDarkTheme={isDarkTheme}
          />
        </SearchInputWrapper>
        <ButtonsContainer>
          <AnimatedButton 
            type="submit" 
            theme={isDarkTheme ? 'dark' : 'light'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSearch /> Search
          </AnimatedButton>
          <AnimatedButton 
            type="button" 
            variant="secondary"
            theme={isDarkTheme ? 'dark' : 'light'}
            onClick={handleLocationSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaMapMarkerAlt /> My Location
          </AnimatedButton>
        </ButtonsContainer>
      </SearchForm>
      
      {showRecentSearches && recentSearches.length > 0 && (
        <RecentSearchesContainer 
          isDarkTheme={isDarkTheme}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <ul>
            {recentSearches.map((search, index) => (
              <RecentSearchItem 
                key={index} 
                isDarkTheme={isDarkTheme}
                onClick={() => handleRecentSearchClick(search)}
              >
                <span className="icon"><FaHistory /></span>
                {search}
              </RecentSearchItem>
            ))}
          </ul>
        </RecentSearchesContainer>
      )}
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
    </SearchContainer>
  );
};

export default SearchBar;
