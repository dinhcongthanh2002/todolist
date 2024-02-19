// Define the tasks atom
import { atom, RecoilState } from "recoil";

export const initSelectedOption: RecoilState<string> = atom({
  key: "selectedOption",
  default: "Tổng quan",
});
