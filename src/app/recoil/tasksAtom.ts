// Define the tasks atom
import { atom } from "recoil";

export const initTasks = atom<
  {
    id: number;
    valueTask: string;
    valueDate: string;
    isDone: boolean;
    buttonType: "done" | "undo";
  }[]
>({
  key: "tasks",
  default: [],
});
