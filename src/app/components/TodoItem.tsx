import React from "react";
import { Button } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
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
      className={`${data.isDone ? "bg-white" : "bg-white"} w-full px-4 py-2 border-b border-[#ccc] flex items-center justify-between`}
    >
      <div
        className={`${data.isDone ? "font-bold" : "font-extralight"} text-primary`}
      >
        <p
          className={`${data.isDone ? "line-through decoration-primary decoration-2 text-decoration-none" : "no-underline"}`}
        >
          {data.valueTask}
        </p>
        <p
          className={`${data.isDone ? "line-through decoration-primary decoration-2 text-decoration-none" : "no-underline"} text-gray-500 text-sm italic`}
        >
          {data.valueDate}
        </p>
      </div>
      <div className={"flex text-white"}>
        <Button
          type={"primary"}
          size={"large"}
          icon={<DeleteOutlined />}
          danger={true}
          onClick={() => deleteTask(index)}
        />

        <Button
          className={`bg-blue-400 ml-2`}
          type={"primary"}
          size={"large"}
          disabled={data.isDone}
          icon={<CheckOutlined />}
          onClick={() => onDone(index)}
        />
      </div>
    </div>
  );
};

export default TodoItem;
