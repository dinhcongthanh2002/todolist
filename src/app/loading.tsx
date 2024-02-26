import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = () => {
  return (
    <Spin
      indicator={
        <LoadingOutlined style={{ fontSize: 50, color: "#eb6e4b" }} spin />
      }
      fullscreen
    />
  );
};

export default Loading;
