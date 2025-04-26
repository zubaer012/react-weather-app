# Weather App

## Description

The Weather App is a simple web application that displays weather information using the OpenWeather API. This app is built with Flask and requires Python version >= 3.5.

![Screenshot](https://my-aws-assets.s3.us-west-2.amazonaws.com/weather-app.png)

## Getting Started

To get started with the Weather App, follow these simple steps:

### Backend (Flask)

1. Navigate to the project directory:

   ```bash
   cd server
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install the required dependencies using `pip`:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask application:

   ```bash
   flask run
   ```

5. Open your web browser and visit [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to access the Weather App.

### Frontend (ReactJS)

1. Navigate to the project directory:

   ```bash
   cd client
   ```

2. Install the required dependencies using `npm`:

   ```bash
   npm install
   ```

3. Run the app in the development mode.

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.