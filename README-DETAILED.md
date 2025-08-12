# 🌤️ Weather Dashboard Application

## What is this?
This is a beautiful, easy-to-use weather application that shows you the current weather and forecasts for any city in the world. You can search for cities, use your current location, or click on a map to get weather information.

![Weather Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=Weather+Dashboard+Screenshot)

## What can this app do?

### Main Features
- **Search for any city** - Type a city name to get its weather
- **Use your location** - Click a button to get weather where you are
- **See current weather** - Temperature, humidity, wind speed, and more
- **Check 5-day forecast** - Plan ahead with a 5-day weather outlook
- **View hourly forecasts** - See how the temperature changes throughout the day
- **Interactive map** - Click anywhere on the map to get weather for that location
- **Switch between dark and light modes** - Choose the look you prefer
- **Responsive design** - Works great on phones, tablets, and computers

## How is it built?

### Two Main Parts:
1. **Frontend** (what you see)
   - Built with React.js
   - Beautiful animations using Framer Motion
   - Charts for temperature data using Chart.js
   - Interactive maps using Leaflet
   - Toast notifications for feedback
   - Dark/light theme switching

2. **Backend** (behind the scenes)
   - Built with Express.js
   - Connects to OpenWeatherMap API
   - Protects your API key
   - Adds security with rate limiting
   - Handles all API requests

## How to Run the App

### What You Need Before Starting
- Node.js installed on your computer
- NPM (comes with Node.js)
- An OpenWeatherMap API key (free to get from their website)

### Step 1: Install Everything
Open a terminal/command prompt and run:
```
cd "path-to-your-project-folder"
npm run install-all
```
This installs all the necessary packages for both frontend and backend.

### Step 2: Set Up Your API Key
Create or edit the `.env` file in the `server` folder with:
```
API_KEY=your_openweathermap_api_key
PORT=5000
```
Replace `your_openweathermap_api_key` with your actual API key.

### Step 3: Start the Application
Run this command to start both the frontend and backend:
```
npm run dev
```

### Step 4: Open the App
Open your web browser and go to:
```
http://localhost:3000
```

## How to Use the App

1. **Search for a City**
   - Type a city name in the search bar
   - Press Enter or click the search button

2. **Get Weather for Your Location**
   - Click the "Use My Location" button
   - Allow location access when prompted

3. **Use the Interactive Map**
   - Scroll to the map section
   - Click anywhere on the map
   - Weather data for that location will load

4. **Switch Between Dark and Light Themes**
   - Click the theme toggle button in the footer

5. **View Different Weather Data**
   - Current conditions are shown at the top
   - Scroll down to see the 5-day forecast
   - Further down is the hourly temperature chart
   - The map section lets you explore weather in different places

## Other Useful Commands

### Run Only the Backend
```
npm run server
```

### Run Only the Frontend
```
npm run client
```

### Create a Production Build
```
npm run build
```

## How the Code is Organized

- **client/** - All frontend React code
  - **src/** - Source code
    - **components/** - Individual UI components
    - **context/** - Global state management
    - **animations/** - Animation configurations

- **server/** - Backend Express code
  - **server.js** - Main server file

## Troubleshooting

### If You See a White Screen
- Check the browser console for errors (F12 key)
- Make sure all dependencies are installed
- Restart the application

### If Weather Data Doesn't Load
- Check if your API key is valid
- Make sure you have internet access
- Check browser console for any error messages

### If the Map Doesn't Work
- Allow location access in your browser
- Make sure you have internet access for loading map tiles

---

Made with ❤️ by Mayur Patel © 2025
