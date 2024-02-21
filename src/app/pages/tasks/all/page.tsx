"use client";

import React, { useEffect, useState } from "react";
import TodoItem from "@/app/components/TodoItem";
import { useRecoilState } from "recoil";
import "react-toastify/dist/ReactToastify.css";

import { initTasks } from "@/app/recoil/tasksAtom";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  initInputDate,
  initInputTask,
  initValueViewDay,
} from "@/app/recoil/initState";
import { initSelectedOption } from "@/app/recoil/selectedOptionAtom";
import { Button, DatePicker, DatePickerProps, Input } from "antd";
import { PlusOutlined, ScheduleOutlined } from "@ant-design/icons";
import { Bounce, toast, ToastContainer } from "react-toastify";

const AllDay = () => {
  const [tasks, setTasks] = useRecoilState(initTasks);
  const [valueTask, setValueTask] = useRecoilState(initInputTask);
  const [valueDate, setValueDate] = useRecoilState(initInputDate);
  const [valueViewDay, setValueViewDay] = useRecoilState(initValueViewDay);
  // const [count, setCount] = useRecoilState(initCountState);
  const [count, setCount] = useState(1);
  const [selectedOption, setSelectedOption] =
    useRecoilState(initSelectedOption);

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
  type Task = {
    id: number;
    title: string;
    isDone: boolean;
    valueTask: string;
    valueDate: string;
    buttonType: "done" | "undo";
  };
  // Lọc công việc dựa trên ngày đã chọn
  const sortedTasks = [...tasks].filter(
    (task) => task.valueDate === valueViewDay || valueViewDay === "all",
  );

  const sortTasks = (tasks: Task[]) => {
    return tasks.sort((a: Task, b: Task) => {
      // Sắp xếp theo ngày mới nhất trước, rồi đến công việc đã hoàn thành
      const isADone = !a.isDone ? 1 : 0;
      const isBDone = !b.isDone ? 1 : 0;
      if (isADone !== isBDone) {
        return isBDone - isADone; // Đưa công việc đã hoàn thành xuống dưới
      }
      const dateA: number = new Date(a.valueDate).getTime();
      const dateB: number = new Date(b.valueDate).getTime();
      return dateB - dateA; // Sắp xếp theo ngày giảm dần
    });
  };
  const handleValueInput = (e: any): void => {
    setValueTask(e.target.value);
  };

  const handleValueDate = (e: any): void => {
    setValueDate(e.target.value);
  };

  const handleViewDayInput: DatePickerProps["onChange"] = (
    date: any,
    dateString: any,
  ) => {
    setValueViewDay(dateString);
  };
  // Hàm xử lý sự kiện nhấn nút "Xem tất cả"
  const handleViewAll = () => {
    setValueViewDay("all");
  };

  // const counter: number = 1;
  const addTask = (e: any) => {
    e.preventDefault();
    if (valueTask.trim() && valueDate.trim() !== "") {
      setTasks((prevTasks) => {
        setCount(count + 1);
        const newTask: Task = {
          id: count, // Generate a unique ID for the new task
          valueTask,
          valueDate,
          title: "",
          isDone: false,
          buttonType: "undo",
        };
        // @ts-ignore
        const newTasks: Task[] = [...prevTasks, newTask];
        const sortedTasks: Task[] = sortTasks(newTasks); // Sắp xếp lại danh sách
        localStorage.setItem("tasks", JSON.stringify(sortedTasks));
        return sortedTasks;
      });
      setValueTask("");
      setValueDate("");

      toast.success("Thêm công việc thành công!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  // Xóa công việc theo index
  const deleteTask = (index: number) => {
    const updatedTasks = [...sortedTasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    toast.error("Xóa công việc thành công!!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
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
    toast.info("Đã hoàn thành công việc!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
  );
  const labels: string[] = [];
  const dataCount: {
    completedTasksCount: number;
    uncompletedTasksCount: number;
  } = {
    completedTasksCount: 0,
    uncompletedTasksCount: 0,
  };
  const background = {
    completedTasksCount: "",
    uncompletedTasksCount: "",
  };

  for (let i of sortedTasks) {
    labels.push(i.valueTask);
    if (i.isDone) {
      dataCount.completedTasksCount++;
      background.completedTasksCount = "#86efac";
    } else {
      dataCount.uncompletedTasksCount++;
      background.uncompletedTasksCount = "#fecaca";
    }
  }
  const data = {
    // labels: labels,
    datasets: [
      {
        label: "Tất cả công việc",
        data: [dataCount.completedTasksCount, dataCount.uncompletedTasksCount],
        backgroundColor: [
          background.completedTasksCount,
          background.uncompletedTasksCount,
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
      response: true,
      tooltip: {
        titleColor: "#fff",
        callbacks: {
          label(tooltipItem: any): string {
            const { label, dataIndex, dataset } = tooltipItem;
            const { backgroundColor } = dataset;
            // Xác định phần được di chuột qua (0: xanh, 1: đỏ)
            const isUnfinishedTasks =
              dataIndex === 1 || backgroundColor === "#fecaca";
            // Kiểm tra phần được di chuột qua và hiển thị nội dung tooltip
            return `${label} Tổng công việc ${isUnfinishedTasks ? "Chưa hoàn thành: " : "Đã hoàn thành: "} ${isUnfinishedTasks ? dataCount.uncompletedTasksCount : dataCount.completedTasksCount}
            `;
          },
        },
      },
    },
  };
  const handleSelectChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div className={"w-full my-10"}>
      <div className={"grid grid-cols-2 gap-10"}>
        <div>
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
                  <Input
                    type="text"
                    placeholder={"Thêm công việc mới"}
                    value={valueTask}
                    autoFocus={true}
                    onChange={handleValueInput}
                    allowClear
                    size={"large"}
                    prefix={<ScheduleOutlined />}
                  />
                  <Input
                    className={"mx-3"}
                    type={"date"}
                    style={{ width: 200 }}
                    value={valueDate}
                    onChange={handleValueDate}
                  />
                </div>
                <Button
                  type={"default"}
                  icon={<PlusOutlined />}
                  onClick={addTask}
                />
              </div>
              <div className={" flex items-center justify-between"}>
                <div>
                  <label htmlFor="viewDay">Chọn ngày:</label>
                  <br />
                  {/*<Input*/}
                  {/*  type={"date"}*/}
                  {/*  style={{ width: 200 }}*/}
                  {/*  onChange={handleViewDayInput}*/}
                  {/*/>*/}
                  <DatePicker onChange={handleViewDayInput} />
                </div>
                <Button type={"default"} size={"large"} onClick={handleViewAll}>
                  Xem tất cả
                </Button>
              </div>
              <div
                className={"w-full bg-[#ccc] mt-4 max-h-[375px] overflow-auto"}
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
        </div>

        <div>
          <h1 className={"uppercase text-4xl font-bold text-center mb-6"}>
            Biểu đồ công việc
          </h1>
          {selectedOption === "Tổng quan" && (
            /*@ts-ignore*/
            <Doughnut data={data} options={options} className={"mx-52"} />
          )}
          {selectedOption === "Hoàn thành" && (
            <Bar
              data={{
                labels: sortedTasks
                  .filter((task) => task.isDone)
                  .map((task) => task.valueTask),
                datasets: [
                  {
                    label: "Công việc đã hoàn thành",
                    data: sortedTasks
                      .filter((task) => task.isDone)
                      .map((task) => task.id),
                    backgroundColor: "rgba(0, 255, 0, 0.4)",
                    borderColor: "rgba(0, 255, 0, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
          {selectedOption === "Chưa hoàn thành" && (
            <Pie
              className={"mx-52"}
              data={{
                labels: sortedTasks
                  .filter((task) => !task.isDone)
                  .map((task) => task.valueTask),
                datasets: [
                  {
                    label: "Công việc chưa hoàn thành",
                    data: sortedTasks
                      .filter((task) => !task.isDone)
                      .map((task) => task.id),
                    backgroundColor: [background.uncompletedTasksCount],
                  },
                ],
              }}
              options={{
                responsive: true,
              }}
            />
          )}
          <div className={"mt-10 flex items-center justify-between"}>
            <DatePicker onChange={handleViewDayInput} />
            <select className={"px-2 py-3"} onChange={handleSelectChange}>
              <option value="Tổng quan">Tổng quan</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Chưa hoàn thành">Chưa hoàn thành</option>
            </select>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default AllDay;
