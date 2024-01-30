// Define the tasks atom
import { atom } from "recoil";

export const initTasks = atom<
  {
    id: string;
    valueTask: string;
    valueDate: string;
    isDone: boolean;
    buttonType: "done" | "undo";
  }[]
>({
  key: "tasks",
  default: [],
});
