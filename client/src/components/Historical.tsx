import React, { useState, useEffect } from 'react';
import '../assets/scss/Historical.scss';
import ExportData from './ExportData';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';

function parseDayOfWeek(dateString: string) {
  // Parse day of the week for each unix datetime
  const date = new Date(dateString);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = date.getDay();

  return weekdays[dayIndex];
}

function Historical({ parentToChild }: any) {

  const { lat, lon, weatherData } = parentToChild;

  const [historicalWeather, setHistoricalWeather] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch historical weather data by passing the current unix datetime
  useEffect(() => {
    setIsLoading(true);
    const fetchHistoricalWeather = async () => {
      if (!lat || !lon || !weatherData?.unix_datetime) {
        console.error('Missing required parameters');
        return;
      }
  
      const apiEndpoint = '/server/historical_weather';
      const historicalWeatherData = [];
  
      // Calculate and call the endpoint for each of the last 7 days
      for (let i = 1; i <= 7; i++) {
        const unixTime = weatherData.unix_datetime - i * 86400;
        const url = `${apiEndpoint}?lat=${lat}&lon=${lon}&time=${unixTime}`;
  
        try {
          const response = await fetch(url);
          const data = await response.json();
  
          if (response.ok) {
            historicalWeatherData.push(data);
          } else {
            console.error(`Error fetching historical weather for day ${i}`);
          }
        } catch (error: any) {
          console.error(`Error fetching historical weather for day ${i}: ${error.message}`);
        }
      }
      setHistoricalWeather(historicalWeatherData);
      setIsLoading(false);
    };
  
    if (weatherData !== null) {
      fetchHistoricalWeather();
    }
  }, [lat, lon, weatherData]);

  return (
    <div>
      {weatherData && isLoading ? (
        <Skeleton className='skeleton-area-hist' height={300}></Skeleton>
      ) : (
        <div>
        {historicalWeather.length > 0 && (
          <div className='historical-root'>
            <Divider/>
            <div className='historical-weather-container'>
              <div>
                <h3>Last 7 days:</h3>
                <div className='history-wrapper' >
                {historicalWeather.map((weather: any, index: number) => (
                  <div className='history-value' key={index}>
                    <div className='date'>{ parseDayOfWeek(weather.date_time) }</div>
                    <div className='weather-info'>
                      <img src={`https://openweathermap.org/img/wn/${weather.icon_id}@2x.png`} alt="Weather Icon" />
                      <div className='temperature'>
                        {weather.temp_f}°
                      </div>
                    </div>
                    <div className='weather-details'>
                      { weather.weather_description.charAt(0).toUpperCase() + weather.weather_description.slice(1) }
                    </div>
                  </div>
                ))}
                </div>
              </div>
              <div className='historical-data-download'>
                <ExportData data={historicalWeather} />
              </div>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Historical;
