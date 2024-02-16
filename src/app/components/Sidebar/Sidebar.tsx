import React from "react";
import { FaTasks } from "react-icons/fa";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className={"text-white font-bold w-full"}>
      <div>
        <h1 className={"uppercase text-center mt-[56px] py-5 bg-gray-500 px-6"}>
          My app
        </h1>
        <div className={"flex items-center py-5 border-b px-6"}>
          <FaTasks className={"mr-2"} />
          <Link href={"/pages/tasks/all"}>Tất cả công việc</Link>
        </div>
        <footer
          className={
            "fixed bottom-0 w-[255px] text-center text-[12px] bg-gray-500 py-4"
          }
        >
          Do not CopyRights, All rights reserved
        </footer>
      </div>
    </div>
  );
};

export default Sidebar;
