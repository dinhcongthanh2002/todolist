import React from "react";

const CountTodo = (props: any) => {
  const { name, count, type } = props;
  return (
    <div className={"min-h-32 flex items-center justify-center flex-col"}>
      <h1 className={"text-base"}>{name}</h1>
      <p
        className={`text-6xl ${type === "completed" ? "text-[#38659a]" : "text-[#fe4f4f]"}`}
      >
        {count}
      </p>
    </div>
  );
};

export default CountTodo;
