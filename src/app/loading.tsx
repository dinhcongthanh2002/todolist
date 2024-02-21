import React from "react";
import { Skeleton } from "antd";

const Loading = () => {
  return (
    <div className={"p-10 py-20"}>
      <Skeleton paragraph={{ rows: 20 }} />
    </div>
  );
};

export default Loading;
