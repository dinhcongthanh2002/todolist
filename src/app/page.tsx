"use client";

import React, { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useRecoilState } from "recoil";
import initState, {
  initThemeMode,
  initValue,
  initValueDateSelect,
} from "./recoil/initState";
import Image from "next/image";
import { ImSun } from "react-icons/im";
import { MdDarkMode } from "react-icons/md";
import TodoItem from "@/app/components/TodoItem";
import { initTasks } from "@/app/recoil/tasksAtom";

interface WeatherTypes {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
    },
  ];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
}
interface Task {
  valueTask: string;
  valueDate: string;
  isDone: boolean;
  buttonType: "done" | "undo";
}

export default function Home() {
  const [tasks, setTasks] = useRecoilState<Task[]>(initTasks);
  const [valueDate, setValueDate] = useRecoilState<string>(initValueDateSelect);
  const [data, setData] = useRecoilState<WeatherTypes | undefined>(initState);
  const [inputValue, setInputValue] = useRecoilState<string>(initValue);
  const [darkMode, setDarkMode] = useRecoilState<boolean>(initThemeMode);
  // Lấy ngày hiện tại
  // const today = new Date().toISOString().slice(0, 10);
  // const curentDay = tasks.filter((task) => task.valueDate === today);
  const todayTasks = tasks.filter((task) => task.valueDate === valueDate);
  useEffect(() => {
    // Load tasks from local storage on component mount
    const storedTasksString = localStorage.getItem("tasks");
    const storedTasks = storedTasksString
      ? (JSON.parse(storedTasksString) as Task[])
      : [];
    setTasks(storedTasks as Task[]);
  }, []);
  useEffect(() => {
    async function getUser() {
      try {
        const response: AxiosResponse<WeatherTypes> = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=e863e3bd98c324a84b149058fc67df5a&lang=vi`,
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getUser();
  }, [inputValue]);

  const handleInputValue = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleInputValueDate = (e: any) => {
    setValueDate(e.target.value);
  };

  const toogleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const deleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  const handleTaskDone = (index: number) => {
    // Di chuyển công việc xuống cuối danh sách và cập nhật trạng thái
    const updatedTasks = [...todayTasks];
    // Lấy task ra khỏi vị trí index
    const task = updatedTasks.splice(index, 1)[0];
    // Thêm task vào cuối danh sách với trạng thái mới
    updatedTasks.push({ ...task, isDone: true, buttonType: "undo" });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };
  return (
    <div
      className={`${darkMode && "dark"} bg-neutral-100 dark:bg-neutral-600 h-screen `}
    >
      <div className={"dark:bg-neutral-600"}>
        <div className={"w-full text-center pt-24"}>
          <input
            className={"px-4 py-2 border-[1px] rounded"}
            type="date"
            onChange={handleInputValueDate}
          />
          <div>
            <input
              className=" px-2 py-1 m-5 border"
              placeholder="Nhập tên thành phố"
              type="text"
              onChange={handleInputValue}
            />
            <button
              className={
                "text-sm font-bold bg-cyan-400 px-3 py-2 rounded text-white hover:bg-cyan-300 dark:bg-cyan-100 dark:text-black"
              }
              onClick={toogleDarkMode}
            >
              {darkMode ? <MdDarkMode /> : <ImSun />}
            </button>
          </div>
        </div>
        <div className={"flex items-center justify-center h-screen"}>
          {/*body*/}
          <div className={"text-white uppercase"}>
            <div
              className={
                "w-[430px] min-h-[430px] bg-sky-300 rounded-3xl shadow-xl"
              }
            >
              <p className={"uppercase text-center font-medium mt-5"}>
                Thời tiết hôm nay
              </p>
              <div className={"text-center"}>
                <p className={"font-bold m-9 text-2xl"}>{data?.name}</p>
                <h1 className={"text-7xl font-medium"}>
                  {data?.main?.temp
                    ? Math.round(data?.main?.temp - 273.15)
                    : null}
                </h1>
                <div className={"flex justify-center items-center m-2"}>
                  <Image
                    width={100}
                    height={100}
                    src={`https://openweathermap.org/img/wn/04d@2x.png`}
                    alt="this is sw"
                  />
                </div>
                <p>{`Quốc gia ${data?.sys?.country}`}</p>
              </div>
              <div
                className={
                  "text-center  flex justify-between items-center mt-14 mb-4 mx-3"
                }
              >
                <div>
                  <p>Độ ẩm</p>
                  <p>{data?.main?.humidity}</p>
                </div>
                <div>
                  <p>Tốc độ gió</p>
                  <p>
                    {data?.wind?.speed
                      ? (data?.wind?.speed * 3.6).toFixed(2)
                      : null}
                    Km/h
                  </p>
                </div>
                <div>
                  <p>Mặt trời mọc</p>
                  <p>{data?.sys?.sunrise}</p>
                </div>
                <div>
                  <p>Mặt trời lặn</p>
                  <p>{data?.sys?.sunset}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              "w-[430px] min-h-[430px] ml-10 bg-gray-100 rounded-3xl shadow-xl"
            }
          >
            <div className={"p-4"}>
              <h1
                className={
                  "uppercase text-center text-2xl font-bold border-b border-gray-400 py-4"
                }
              >
                Công việc ngày hôm nay
              </h1>
              <div
                className={"w-full bg-[#ccc] mt-4 max-h-[360px] overflow-auto"}
              >
                {todayTasks.length > 0 &&
                  todayTasks.map((data, index: number) => (
                    <TodoItem
                      key={index}
                      index={index}
                      data={data}
                      deleteTask={deleteTask}
                      onDone={handleTaskDone}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
