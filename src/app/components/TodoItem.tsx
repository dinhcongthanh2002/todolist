import React from "react";
interface TodoItemProps {
  data: {
    id: number;
    valueTask: string;
    valueDate: string;
    isDone: boolean;
    buttonType: "done" | "undo";
  };
  index: number;
  deleteTask: (index: number) => void;
  onDone: (index: number) => void;
}
const TodoItem: React.FC<TodoItemProps> = ({
  data,
  index,
  deleteTask,
  onDone,
}) => {
  return (
    <div
      className={`${data.isDone ? "bg-[#88AB8E]" : "bg-[#E36414]"} w-full px-4 py-4 border-b border-white flex items-center justify-between`}
    >
      <div>
        <p
          className={`${data.isDone ? "line-through decoration-black decoration-2 text-decoration-none" : "no-underline"}`}
        >
          {data.valueTask}
        </p>
        <p className={"text-gray-500 text-sm italic"}>{data.valueDate}</p>
      </div>
      <div className={"flex text-white"}>
        <div
          className={"py-2 px-4 bg-red-500 rounded font-bold cursor-pointer"}
          onClick={() => deleteTask(index)}
        >
          Xóa
        </div>
        <div
          className={`py-2 px-4 rounded font-bold bg-sky-400 cursor-pointer ml-2`}
          onClick={() => onDone(index)}
        >
          Xong
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
