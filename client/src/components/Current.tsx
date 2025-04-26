import React, { useState, useEffect } from 'react';
import '../assets/scss/Current.scss';

// Import MUI framework for styling
import AirIcon from '@mui/icons-material/Air';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Skeleton from '@mui/material/Skeleton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WaterIcon from '@mui/icons-material/Water';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  height: '500px',
  width: '600px',
  overflow: 'scroll',
};

function Current({ parentToChild, onWeatherDataChange }: any) {

  const { lat, lon, selectedLocation } = parentToChild;
  
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Invoke modal
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Format json file as a pretty string
  const PrettyJsonDisplay = ({ jsonString }: any) => {
    const jsonObject = JSON.parse(jsonString);
    const prettyJsonString = JSON.stringify(jsonObject, null, 2);
    return (
      <pre>
        {prettyJsonString}
      </pre>
    );
  };

  // Fetch current weather data
  useEffect(() => {
    setIsLoading(true);
    const fetchWeatherData = async () => {
      try {
        // Check if lat and lon are defined before making the API call
        if (lat !== undefined && lon !== undefined) {
          const response = await fetch(`/server/current_weather?lat=${lat}&lon=${lon}`);
          if (response.ok) {
            const data = await response.json();
            setWeatherData(data);
            // Pass weatherData to parent component
            onWeatherDataChange(data);
            setIsLoading(false)
          } else {
            console.error('Error fetching weather data');
          }
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon]);

  return (
    <div>
      {weatherData ? (
        <div className="weather-container">
          <div className='weather-header'>
            <h2 className="location">{selectedLocation ? selectedLocation.name : 'Dallas, Texas (US)'}</h2>
            <span>{weatherData.current_time}</span>
          </div>
          <div className='location-geocodes'>
            <div className="lat">Latitude: {weatherData.latitude}</div>
            <div className="lon">Longitude: {weatherData.longitude}</div>
          </div>
          <div className="weather-info">
            <div className="temperature">
              <img src={`https://openweathermap.org/img/wn/${weatherData.icon_id}@2x.png`} alt="Weather Icon" />
              <span>{weatherData.temp_f}</span>°F
            </div>
            <div className="time-description">
              <div className="time">{weatherData.current_date}</div>
              <div className="description">{weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}</div>
            </div>
          </div>
          <div className="additional-info">
            <div className='info-left'>
              <div className="precipitation"><WaterDropIcon/>Precipitation: {Math.round(weatherData.precipitation * 100)}%</div>
              <div className="humidity"><WaterIcon/>Humidity: {weatherData.humidity}%</div>
              <div className="wind"><AirIcon/>Wind speed: {weatherData.wind_speed}m/s</div>
            </div>
            <div className='info-right'>
              <Button onClick={handleOpen} variant="contained" endIcon={<VisibilityIcon />}>
                View output
              </Button>
              <Modal
                className='raw-json-modal'
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <h3>Raw JSON Output from API</h3>
                  <PrettyJsonDisplay jsonString={JSON.stringify(weatherData.raw_json)}/>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {selectedLocation ? (
            <div>
              {isLoading && 
                <Skeleton className='skeleton-area-current' height={150}></Skeleton>
              }
            </div>
          ) : (
              <p>Welcome! Please enter the name of a city to see the weather information.</p>
          )}          
        </div>
      )}
    </div>
  );
}

export default Current;
