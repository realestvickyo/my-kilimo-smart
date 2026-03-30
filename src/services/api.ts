import axios from 'axios';
import { MarketPrice, PestAlert } from '../types';
import { authService } from './authService';

// @ts-ignore
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const weatherService = {
  getForecast: async (location: string) => {
    if (!OPENWEATHER_API_KEY) {
      console.warn("OpenWeather API Key missing. Using mock data.");
      return null;
    }
    if (!location || location.trim() === "") {
      console.warn("Weather location is empty. Skipping API call.");
      return null;
    }

    const queryStr = (location && location.trim() !== "") 
      ? (location.toLowerCase().includes('kenya') ? location : `${location}, Kenya`)
      : "Nairobi, Kenya";

    try {
      // Get current weather and forecast in parallel for precision
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: { q: queryStr, appid: OPENWEATHER_API_KEY, units: 'metric' }
        }),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: { q: queryStr, appid: OPENWEATHER_API_KEY, units: 'metric' }
        })
      ]);

      // Merge current weather into the first item of the forecast list for a "precise" today view
      const forecastData = forecastRes.data;
      if (forecastData.list && forecastData.list.length > 0) {
        // Merge current data into the first forecast slot (Today)
        forecastData.list[0].main.temp = currentRes.data.main.temp;
        forecastData.list[0].main.temp_max = currentRes.data.main.temp_max;
        forecastData.list[0].main.temp_min = currentRes.data.main.temp_min;
        forecastData.list[0].weather = currentRes.data.weather;
        forecastData.list[0].wind = currentRes.data.wind;
        forecastData.list[0].main.humidity = currentRes.data.main.humidity;
        
        // Convert wind speed from m/s to km/h for Kenyan standards
        if (forecastData.list[0].wind && forecastData.list[0].wind.speed) {
          forecastData.list[0].wind.speed_kmh = Math.round(forecastData.list[0].wind.speed * 3.6);
        }
        
        forecastData.current = currentRes.data; // Store full current data too
      }

      return forecastData;
    } catch (error) {
      console.error("Weather API error for location:", queryStr, error);
      // Fallback to Nairobi if the specific location fails and we weren't already querying Nairobi
      if (queryStr !== "Nairobi, Kenya") {
        return weatherService.getForecast("Nairobi, Kenya");
      }
      return null;
    }
  }
};

export const marketService = {
  getLivePrices: async (): Promise<MarketPrice[]> => {
    try {
      return await authService.getMarketPrices();
    } catch (error) {
      console.error("Market API Error:", error);
      return [];
    }
  }
};

export const paymentService = {
  initiateStkPush: async (phone: string, amount: number) => {
    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ phone, amount })
      });
      return await response.json();
    } catch (error) {
      console.error("M-Pesa API Error:", error);
      return { error: "Failed to initiate payment" };
    }
  }
};

export const pestService = {
  getAdminAlerts: async (): Promise<PestAlert[]> => {
    try {
      return await authService.getPestAlerts();
    } catch (error) {
      console.error("Error fetching admin alerts:", error);
      return [];
    }
  },
  getAlerts: (weatherData: any, crops: string[]): PestAlert[] => {
    const alerts: PestAlert[] = [];
    if (!weatherData || !weatherData.list) return [];

    const current = weatherData.list[0];
    const humidity = current.main.humidity;
    const temp = current.main.temp;
    const weatherMain = current.weather[0].main.toLowerCase();
    const rain = weatherMain.includes('rain');

    const cropNames = crops.map(c => c.toLowerCase());

    if (humidity > 80 && temp > 20 && cropNames.some(c => c.includes('maize'))) {
      alerts.push({
        id: 'armyworm',
        title: 'Fall Armyworm Risk',
        description: 'High humidity and warm temperatures are ideal for Fall Armyworm. Inspect your maize crops immediately.',
        severity: 'high',
        location: 'Your Farm',
        timestamp: new Date().toISOString()
      });
    }

    if (rain && temp < 18 && cropNames.some(c => c.includes('potato') || c.includes('tomato'))) {
      alerts.push({
        id: 'late-blight',
        title: 'Late Blight Warning',
        description: 'Cool, wet conditions detected. High risk of Late Blight in potato/tomato crops. Apply preventive fungicide.',
        severity: 'high',
        location: 'Your Farm',
        timestamp: new Date().toISOString()
      });
    }

    if (temp > 30 && humidity < 40) {
      alerts.push({
        id: 'spider-mite',
        title: 'Spider Mite Alert',
        description: 'Hot and dry conditions favor spider mite outbreaks. Monitor your crops for webbing and yellowing.',
        severity: 'moderate',
        location: 'Your Farm',
        timestamp: new Date().toISOString()
      });
    }

    if (weatherMain.includes('clear') && temp > 25) {
      alerts.push({
        id: 'aphids',
        title: 'Aphid Activity',
        description: 'Warm, clear weather increases aphid activity. Check new growth for clusters of insects.',
        severity: 'low',
        location: 'Your Farm',
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }
};
