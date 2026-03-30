import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudLightning, Thermometer, Droplets, Wind, Loader2, MapPin } from 'lucide-react';
import { WeatherDay } from '../types';
import { weatherService } from '../services/api';

interface WeatherWidgetProps {
  location: string;
  weatherData?: any;
}

const WeatherIcon = ({ condition, size = 24 }: { condition: string, size?: number }) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return <Sun size={size} className="text-yellow-500" />;
  if (cond.includes('cloud')) return <Cloud size={size} className="text-stone-400" />;
  if (cond.includes('rain')) return <CloudRain size={size} className="text-blue-400" />;
  if (cond.includes('storm')) return <CloudLightning size={size} className="text-purple-500" />;
  return <Cloud size={size} className="text-stone-400" />;
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location, weatherData }) => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(!weatherData);

  useEffect(() => {
    const processData = (data: any) => {
      if (data && data.list) {
        const daily = data.list.filter((item: any) => item.dt_txt.includes('12:00:00')).slice(0, 5).map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
          precipitation: Math.round(item.pop * 100),
          icon: item.weather[0].icon
        }));

        // If we have precise current data, override the first day's high/low with current temp for "Today"
        if (data.current && daily.length > 0) {
          daily[0].high = Math.round(data.current.main.temp);
          daily[0].condition = data.current.weather[0].description || data.current.weather[0].main;
          daily[0].humidity = data.current.main.humidity;
          // Use the km/h speed we calculated in the service
          daily[0].wind_kmh = Math.round(data.current.wind.speed * 3.6);
        }

        setForecast(daily);
      }
    };

    if (weatherData) {
      processData(weatherData);
      setLoading(false);
    } else {
      const fetchWeather = async () => {
        setLoading(true);
        const data = await weatherService.getForecast(location);
        processData(data);
        setLoading(false);
      };
      fetchWeather();
    }
  }, [location, weatherData]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-emerald-600 to-blue-700 rounded-[3rem] p-10 text-white flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-white/50" size={48} />
      </div>
    );
  }

  const today = forecast[0];
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
      
      <div className="relative z-10 space-y-8">
        {/* Main Weather Info */}
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-black tracking-tighter leading-none">{today?.high || '--'}</span>
              <span className="text-4xl font-bold text-emerald-200">°C</span>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold capitalize text-emerald-50">{today?.condition || 'Clear Sky'}</p>
              <p className="text-sm font-medium text-emerald-100/70">{currentDate} • {location}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                <Droplets size={14} className="text-emerald-300" />
                <span className="text-xs font-black uppercase tracking-widest">{today?.humidity || '59'}%</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                <Wind size={14} className="text-emerald-300" />
                <span className="text-xs font-black uppercase tracking-widest">{today?.wind_kmh || '12'} km/h</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl">
            <WeatherIcon condition={today?.condition || ''} size={80} />
          </div>
        </div>

        {/* 5-Day Forecast Row */}
        <div className="grid grid-cols-5 gap-2 pt-8 border-t border-white/10">
          {forecast.map((day, i) => (
            <div key={day.date} className="flex flex-col items-center gap-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/70">{day.date}</p>
              <WeatherIcon condition={day.condition} size={24} />
              <div className="text-center">
                <p className="text-sm font-black">{day.high}°</p>
                <p className="text-[10px] font-bold text-emerald-300/50">{day.precipitation}%</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <p className="text-[8px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1">
            <Loader2 size={8} className="animate-spin" />
            Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

const WeatherDetail = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-3">
    <div className="text-stone-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-stone-900">{value}</p>
    </div>
  </div>
);
