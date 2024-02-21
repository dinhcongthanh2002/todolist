"use client";

import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Image, Modal } from "antd";
import { initTasks } from "@/app/recoil/tasksAtom";
import {
  initState,
  initThemeMode,
  initValue,
  initValueDateSelect,
} from "@/app/recoil/initState";
import { WiHumidity } from "react-icons/wi";
import TodoItem from "@/app/components/TodoItem";
import { weatherState } from "@/app/recoil/weather/weatherState";
import { getWeatherData } from "@/app/services/weatherDataService";
import { CarryOutOutlined } from "@ant-design/icons";

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
  const [weatherData, setWeatherData] = useRecoilState(weatherState);
  const [inputValue, setInputValue] = useRecoilState<string>(initValue);

  const today: Date = new Date();
  const day: number = today.getDate();
  // Tháng trong JavaScript bắt đầu từ 0
  const month: number = today.getMonth() + 1;
  const year: number = today.getFullYear();

  const formattedDate = `${day} THÁNG ${month} NĂM ${year}`;

  const sunrise: number = weatherData.sys?.sunrise;
  const sunset: number = weatherData.sys?.sunset;

  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);

  const sunriseHour = sunriseDate.getHours();
  const sunriseMinute = sunriseDate.getMinutes();
  const sunsetHour = sunsetDate.getHours();
  const sunsetMinute = sunsetDate.getMinutes();

  const pressureValue: number = weatherData?.main?.pressure;
  const pressureStatus: string = getPressureStatus(pressureValue);
  // @ts-ignore
  const [tasks, setTasks] = useRecoilState<Task[]>(initTasks);
  const [valueDate, setValueDate] = useRecoilState<string>(initValueDateSelect);
  const todayTasks = tasks.filter((task) => task.valueDate === valueDate);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWeatherData(inputValue);
      setWeatherData(data);
    };
    fetchData();
  }, [inputValue]);

  function getPressureStatus(pressure: any): string {
    switch (true) {
      case pressure < 980:
        return "thấp";
      case pressure >= 980 && pressure < 1010:
        return "Bình thường";
      default:
        return "cao";
    }
  }

  useEffect(() => {
    // Load tasks from local storage on component mount
    const storedTasksString = localStorage.getItem("tasks");
    const storedTasks = storedTasksString
      ? (JSON.parse(storedTasksString) as Task[])
      : [];
    setTasks(storedTasks as Task[]);
  }, []);
  const handleInputValueDate = (e: any) => {
    setValueDate(e.target.value);
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
    <div>
      <div className={"flex flex-col items-center justify-center mt-10"}>
        <div className={"w-[632px] h-auto"}>
          <h1 className={"uppercase my-3 text-primary"}>{formattedDate}</h1>
          {/*Thời tiết*/}
          <div className={"w-full min-h-[236px] p-3 bg-white"}>
            <div>
              {/*header*/}
              <div className={"flex items-center justify-between"}>
                <div className={"flex items-center"}>
                  {/*ICON*/}
                  <div className={"mx-3"}>
                    <Image
                      width={80}
                      src={`https://openweathermap.org/img/wn/${weatherData?.weather ? weatherData?.weather[0]?.icon : null}@2x.png`}
                    />
                  </div>
                  <div className={"flex items-end"}>
                    <p className={"text-5xl text-primary font-bold"}>
                      {weatherData?.main?.temp
                        ? Math.round(weatherData?.main?.temp - 273.15)
                        : null}
                      °
                    </p>
                    <p className={"text-gray-400 text-xl"}>
                      /
                      {weatherData?.main?.temp
                        ? Math.round(weatherData?.main?.temp_max - 273.15)
                        : null}
                      °
                    </p>
                  </div>
                </div>
                {/*HUMIDITY*/}
                <div className={"mr-10"}>
                  <p
                    className={
                      "flex items-center text-gray-400 font-bold text-primary text-base"
                    }
                  >
                    {<WiHumidity className={"text-2xl"} />}{" "}
                    {weatherData?.main?.humidity}%
                  </p>
                </div>
              </div>
              {/*DESCRIPTION*/}
              <h1 className={"py-4 text-lg text-primary"}>
                {weatherData?.weather
                  ? weatherData?.weather[0]?.description
                  : null}
              </h1>
              {/*FOOTER*/}
              <div className={"text-base grid grid-cols-2 grid-rows-2 gap-x-7"}>
                {/*ITEM1*/}
                <div className={"py-2 border-b"}>
                  <div className={"flex items-center justify-between"}>
                    Mặt trời mọc{" "}
                    <p className={"text-lg text-primary font-bold"}>
                      {sunriseHour}:{sunriseMinute}
                    </p>
                  </div>
                </div>
                {/*ITEM 2*/}
                <div className={"py-2 border-b"}>
                  <div className={"flex items-center justify-between"}>
                    Áp suất{" "}
                    <p className={"text-lg text-primary font-bold"}>
                      {pressureStatus}
                    </p>
                  </div>
                </div>
                {/*ITEM 3*/}
                <div className={"py-2"}>
                  <div className={"flex items-center justify-between"}>
                    Mặt trời lặn{" "}
                    <p className={"text-lg text-primary font-bold"}>
                      {sunsetHour}:{sunsetMinute}
                    </p>
                  </div>
                </div>
                {/*ITEM 4*/}
                <div className={"py-2"}>
                  <div className={"flex items-center justify-between "}>
                    Tốc độ gió{" "}
                    <p className={"text-lg text-primary font-bold"}>
                      {(weatherData?.wind?.speed * 3.6).toFixed(2)} km/h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*TODOLIST*/}
          <div className={"w-full min-h-[430px] mt-5 bg-white"}>
            <div className={"p-4"}>
              <h1
                className={
                  "uppercase text-center text-2xl font-bold border-b border-gray-400 py-4"
                }
              >
                Công việc ngày hôm nay
              </h1>
              <div className={"w-full mt-4 max-h-[360px] overflow-auto"}>
                <input
                  className={"px-4 py-2 border-[1px] rounded"}
                  type="date"
                  // value={todayFormatted}
                  // disabled={true}
                  onChange={handleInputValueDate}
                />
                <div
                  className={
                    "w-full mt-4 min-h-[300px] max-h-[360px] overflow-auto"
                  }
                >
                  {todayTasks.length > 0 ? (
                    todayTasks.map((data, index: number) => (
                      <TodoItem
                        key={index}
                        index={index}
                        // @ts-ignore
                        data={data}
                        deleteTask={deleteTask}
                        onDone={handleTaskDone}
                      />
                    ))
                  ) : (
                    <div
                      className={
                        "flex flex-col items-center justify-center min-h-[300px]"
                      }
                    >
                      <p className={"text-6xl "}>¯⁠\⁠_⁠(⁠ツ⁠)⁠_⁠/⁠¯</p>
                      <p className={"py-6 text-lg italic text-gray-400"}>
                        Không có công việc nào...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
