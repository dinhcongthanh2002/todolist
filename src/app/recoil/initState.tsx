"use client";

import { atom } from "recoil";

export const initState: any = atom({
  key: "weatherData",
  default: [],
});
export const initValue: any = atom({
  key: "inputValue",
  default: "Ha noi",
});
export const initThemeMode: any = atom({
  key: "darkMode",
  default: false,
});
export const initInputTask: any = atom({
  key: "inputTask",
  default: "",
});
export const initInputDate: any = atom({
  key: "inputDate",
  default: "",
});
export const initValueDateSelect: any = atom({
  key: "inputValueDate",
  default: "",
});
export const initValueViewDay: any = atom({
  key: "inputValueViewDay",
  default: "",
});
export default initState;
