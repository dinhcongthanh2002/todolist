"use client";

import { atom, RecoilState } from "recoil";

export const initState: RecoilState<[]> = atom({
  key: "weatherData",
  default: [],
});
export const initValue: RecoilState<string> = atom({
  key: "inputValue",
  default: "Hà nội",
});
export const initThemeMode: RecoilState<boolean> = atom({
  key: "darkMode",
  default: false,
});
export const initInputTask: RecoilState<string> = atom({
  key: "inputTask",
  default: "",
});
export const initInputDate: RecoilState<string> = atom({
  key: "inputDate",
  default: "",
});
export const initValueDateSelect: RecoilState<string> = atom({
  key: "inputValueDate",
  default: "",
});
export const initValueViewDay: RecoilState<string> = atom({
  key: "inputValueViewDay",
  default: "all",
});
export default initState;
