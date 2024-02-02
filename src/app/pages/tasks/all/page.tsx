"use client";

import React, { useEffect, useState } from "react";
import TodoItem from "@/app/components/TodoItem";
import { useRecoilState } from "recoil";
import {
  initInputDate,
  initInputTask,
  initValueViewDay,
} from "@/app/recoil/initState";
import Link from "next/link";
import { initTasks } from "@/app/recoil/tasksAtom";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const AllDay = () => {
  const [tasks, setTasks] = useRecoilState(initTasks);
  const [valueTask, setValueTask] = useRecoilState<string>(initInputTask);
  const [valueDate, setValueDate] = useRecoilState<string>(initInputDate);
  const [valueViewDay, setValueViewDay] =
    useRecoilState<string>(initValueViewDay);
  const [count, setCount] = useState(1);
  // let uuid = crypto.randomUUID();
  useEffect(() => {
    // Load công việc từ local storage khi component được mount
    const storedTasksString: string | null = localStorage.getItem("tasks");
    const storedTasks =
      storedTasksString && JSON.parse(storedTasksString)
        ? JSON.parse(storedTasksString)
        : [];
    setTasks(storedTasks);
  }, []);
  // Lọc công việc dựa trên ngày đã chọn
  const sortedTasks: any[] = [...tasks].filter(
    (task) => task.valueDate === valueViewDay || valueViewDay === "all",
  );
  type Task = {
    title: string;
    isDone: boolean;
    valueDate: string;
    id: number;
  };
  const sortTasks = (tasks: Task[]) => {
    return tasks.sort((a: Task, b: Task) => {
      // Sắp xếp theo ngày mới nhất trước, rồi đến công việc đã hoàn thành
      const isADone = !a.isDone ? 1 : 0;
      const isBDone = !b.isDone ? 1 : 0;
      if (isADone !== isBDone) {
        return isBDone - isADone; // Đưa công việc đã hoàn thành xuống dưới
      }
      const dateA = new Date(a.valueDate).getTime();
      const dateB = new Date(b.valueDate).getTime();
      return dateB - dateA; // Sắp xếp theo ngày giảm dần
    });
  };
  const handleValueInput = (e: any): void => {
    setValueTask(e.target.value);
  };

  const handleValueDate = (e: any): void => {
    setValueDate(e.target.value);
  };

  const handleViewDayInput = (e: any) => {
    setValueViewDay(e.target.value);
  };
  // Hàm xử lý sự kiện nhấn nút "Xem tất cả"
  const handleViewAll = () => {
    setValueViewDay("all");
  };

  // const counter: number = 1;
  const addTask = (e: any) => {
    e.preventDefault();
    if (valueTask.trim() && valueDate.trim() !== "") {
      setTasks((prevTasks: Task[]) => {
        setCount(count + 1);
        const newTask: Task = {
          id: count, // Generate a unique ID for the new task
          valueTask,
          valueDate,
        };
        const newTasks: Task[] = [...prevTasks, newTask];
        const sortedTasks: Task[] = sortTasks(newTasks); // Sắp xếp lại danh sách
        localStorage.setItem("tasks", JSON.stringify(sortedTasks));
        return sortedTasks;
      });
      setValueTask("");
      setValueDate("");
    }
  };
  // Xóa công việc theo index
  const deleteTask = (index: number) => {
    const updatedTasks = [...sortedTasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  //đánh dấu hoàn thành công việc
  const handleTaskDone = (index: number) => {
    // Di chuyển công việc xuống cuối danh sách và cập nhật trạng thái
    const updatedTasks = [...sortedTasks];
    // Lấy task ra khỏi vị trí index
    const task = updatedTasks.splice(index, 1)[0];
    // Thêm task vào cuối danh sách với trạng thái mới
    updatedTasks.push({ ...task, isDone: true, buttonType: "undo" });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  // const dataCountCompleted: number[] = [];
  // const dataCountNotCompleted: number[] = [];

  ChartJS.register(ArcElement, Tooltip, Legend);
  const labels: string[] = [];
  const dataCount: number[] = [];
  const backgroundColors: string[] = [];

  for (let i of sortedTasks) {
    labels.push(i.valueTask);
    dataCount.push(i.id);
    backgroundColors.push(i.isDone ? "#88AB8E" : "#E36414");
  }
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Tất cả công việc",
        data: dataCount,
        backgroundColor: backgroundColors,
        // borderColor: ["#163020"],
        // borderWidth: 1,
      },
    ],
  };
  const completedTasksCount = sortedTasks.filter((task) => task.isDone).length;
  const uncompletedTasksCount = sortedTasks.length - completedTasksCount;
  console.log(completedTasksCount, uncompletedTasksCount);
  // const options = {
  //   tooltips: {
  //     callbacks: {
  //       label: (tooltipItem: any, data: any) => {
  //         const label = data.labels[tooltipItem.index];
  //         const value =
  //           data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
  //
  //         return (
  //           `${label}: ${value}\n` +
  //           `Đã hoàn thành: ${completedTasksCount}\n` +
  //           `Chưa hoàn thành: ${uncompletedTasksCount}`
  //         );
  //       },
  //     },
  //   },
  // };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
      response: true,
      tooltip: {
        titleColor: "#fff",
        callbacks: {
          label: () => {
            return (
              `Đã hoàn thành: ${completedTasksCount} \n` +
              `Chưa hoàn thành: ${uncompletedTasksCount}`
            );
          },
        },
      },
    },
  };

  return (
    <div className={"w-full h-screen flex items-center justify-center"}>
      <div>
        <div className={"italic underline"}>
          <Link href="/">Về trang chủ</Link>
        </div>
        <div
          className={
            "w-[750px] max-h-[600px] h-[600px] bg-gray-100 rounded shadow-2xl px-10"
          }
        >
          <h1
            className={
              "text-center uppercase text-4xl font-bold py-4 border-b border-gray-400"
            }
          >
            quản lý tất cả công việc
          </h1>
          <div className={"my-5"}>
            <div className={"flex items-center"}>
              <div className={"flex-1 flex"}>
                <input
                  className={
                    "flex-1 mr-3 border-gray-400 border rounded py-2 px-4"
                  }
                  type="text"
                  autoFocus={true}
                  value={valueTask}
                  placeholder={"Thêm công việc mới"}
                  onChange={handleValueInput}
                />
                <input
                  className={"border-gray-400 border rounded py-2 px-4"}
                  type="date"
                  value={valueDate}
                  onChange={handleValueDate}
                />
              </div>
              <button
                className={
                  "py-2 px-4 bg-sky-400 rounded font-bold text-white hover:bg-sky-300 ml-4"
                }
                onClick={addTask}
              >
                Thêm
              </button>
            </div>
            <div
              className={"w-full bg-[#ccc] mt-4 max-h-[425px] overflow-auto"}
            >
              {/*item*/}
              {sortedTasks.length > 0 &&
                sortedTasks.map((task, index: number) => (
                  <TodoItem
                    key={index}
                    index={index}
                    data={task}
                    deleteTask={deleteTask}
                    onDone={handleTaskDone}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className={"mt-4 flex items-center justify-between"}>
          <div>
            <label htmlFor="viewDay">Chọn ngày:</label>
            <br />
            <input
              id={"viewDay"}
              className={"px-4 py-2 rounded border"}
              type="date"
              onChange={handleViewDayInput}
            />
          </div>
          <button
            className={"px-4 py-2 bg-sky-300 text-white font-bold ml-4"}
            onClick={handleViewAll}
          >
            Xem tất cả
          </button>
        </div>
      </div>
      <div className={"ml-20"}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default AllDay;
