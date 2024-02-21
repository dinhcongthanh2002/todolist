import axios from "axios";

const API_KEY = "e863e3bd98c324a84b149058fc67df5a";

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    temp_max: number;
    pressure: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    },
  ];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

export const getWeatherData = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=vi`,
  );
  return response.data;
};
