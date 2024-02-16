// Define the tasks atom
import { atom, RecoilState } from "recoil";

export const initCountState: RecoilState<number> = atom({
  key: "count",
  default: 1,
});
