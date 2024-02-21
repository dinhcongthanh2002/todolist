import { WeatherData } from "@/app/services/weatherDataService";
import { atom } from "recoil";

export const weatherState = atom<WeatherData>({
  key: "weatherState",
  default: {},
});
