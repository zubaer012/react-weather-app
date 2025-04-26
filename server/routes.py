from flask import render_template, jsonify, request, send_from_directory
import requests
from app import app
import os
from server.utils import format_unix_time, kelvin_to_celsius, celsius_to_fahrenheit

API_KEY = os.environ.get('API_KEY')

# Serve React frontend
@app.route("/")
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/server/coordinates')
def get_coordinates():
    # Use Geocoding API to convert city name to latitude and longitude
    city_name = request.args.get('city_name', default=None)
    url = f'http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=5&appid={API_KEY}'

    response = requests.get(url)
    data = response.json()

    if response.status_code == 200 and data:
        result = []
        for location in data:
            result_dict = {
                'lat': location['lat'],
                'lon': location['lon'],
                'location': f"{location['name']}, {location['state'] if 'state' in location else ''} ({location['country']})"
            }
            result.append(result_dict)

        return jsonify(result)
    else:
        return jsonify([])

@app.route('/server/current_weather')
def get_current_weather():
    # Get the current weather data by city name
    lat = request.args.get('lat', default=None)
    lon = request.args.get('lon', default=None)

    if not lat or not lon:
        return jsonify({'error': 'Unable to fetch coordinates for the specified city'}), 404

    url = f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly&appid={API_KEY}'
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        current_weather = data.get('current', {})
        daily_weather = data.get('daily', {})[0]
        weather_description = current_weather.get('weather', [{}])[0]
        current_date = format_unix_time(current_weather.get('dt', 0), data.get('timezone_offset', 0))
        current_time = format_unix_time(current_weather.get('dt', 0), data.get('timezone_offset', 0))
        temp_c = kelvin_to_celsius(current_weather.get('temp', 0))
        temp_f = celsius_to_fahrenheit(temp_c)

        formatted_response = {
            'raw_json': data,
            'main_weather': weather_description.get('main', ''),
            'description': weather_description.get('description', ''),
            'icon_id': weather_description.get('icon', ''),
            'unix_datetime': current_weather.get('dt', 0),
            'current_date': current_date[0],
            'current_time': current_time[1],
            'humidity': current_weather.get('humidity', 0),
            'wind_speed': current_weather.get('wind_speed', 0),
            'precipitation': daily_weather.get('pop', 0),
            'temp_c': temp_c,
            'temp_f': temp_f,
            'latitude': data.get('lat', 0),
            'longitude': data.get('lon', 0),
        }
        return jsonify(formatted_response)
    else:
        return jsonify({'error': 'Unable to fetch current weather'}), 500
    
@app.route('/server/historical_weather')
def get_historical_weather():
    # Get the historical weather data by city name

    lat = request.args.get('lat', default=None)
    lon = request.args.get('lon', default=None)

    if not lat or not lon:
        return jsonify({'error': 'Please provide the lat and lon parameters'}), 404
    
    time = request.args.get('time', default=None)
    
    if time == None:
        return jsonify({'error': 'Please provide the time in the Unix format'}), 404

    url = f'https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API_KEY}'
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        historical_data = data.get('data', [])
        weather_data = historical_data[0]
        weather_description = weather_data.get('weather', [{}])[0]

        formatted_response = {
            'date_time': format_unix_time(weather_data.get('dt', 0), data.get('timezone_offset', 0)),
            'temp_c': kelvin_to_celsius(weather_data.get('temp', 0)),
            'temp_f': celsius_to_fahrenheit(kelvin_to_celsius(weather_data.get('temp', 0))),
            'weather_main': weather_description.get('main', ''),
            'weather_description': weather_description.get('description', ''),
            'icon_id': weather_description.get('icon', ''),
        }
        return jsonify(formatted_response)
    else:
        return jsonify({'error': 'Unable to fetch current weather'}), 500