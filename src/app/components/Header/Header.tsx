import React from "react";
import Link from "next/link";
import { MdDarkMode } from "react-icons/md";
import { ImSun } from "react-icons/im";

const Header = () => {
  return (
    <div
      className={
        "w-full h-14 bg-gray-600 flex items-center justify-end fixed top-0 left-0 right-0 px-4 dark:bg-neutral-600"
      }
    >
      <Link className={"text-white font-bold dark:text-white"} href={"/"}>
        WeatherMap
      </Link>
    </div>
  );
};

export default Header;
