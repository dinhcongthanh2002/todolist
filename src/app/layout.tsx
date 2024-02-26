"use client";

import { Inter } from "next/font/google";
import "./styles/globals.css";
import { RecoilRoot } from "recoil";
import { ConfigProvider, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import {
  DashboardOutlined,
  HomeOutlined,
  SunOutlined,
} from "@ant-design/icons";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <RecoilRoot>
          <ConfigProvider
            theme={{
              token: {},
              components: {
                Menu: {
                  itemHoverBg: "#fff7e6",
                  itemSelectedBg: "#fff7e6",
                  itemSelectedColor: "#eb6e4b",
                },
              },
            }}
          >
            <Layout className={"text-black"}>
              <Header
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#48484a",
                  color: "#eb6e4b",
                }}
              >
                <Link className={" font-bold"} href={"/"}>
                  <SunOutlined className={"pr-2"} />
                  WeatherMap
                </Link>
              </Header>
              <Layout>
                <Sider width={200} style={{ background: "#fff" }}>
                  <div>
                    <Menu
                      mode="inline"
                      style={{
                        height: "100%",
                        borderRight: 0,
                      }}
                      defaultSelectedKeys={["/"]}
                      items={[
                        {
                          label: <Link href={"/"}>Home</Link>,
                          key: "/",
                          icon: <HomeOutlined />,
                        },
                        {
                          label: (
                            <Link href={"/pages/tasks/all"}>Dashboard</Link>
                          ),
                          key: "/pages/tasks/all",
                          icon: <DashboardOutlined />,
                        },
                      ]}
                    />
                  </div>
                </Sider>
                <Content
                  style={{ padding: "0 24px", minHeight: 500, height: "100vh" }}
                >
                  {children}
                </Content>
              </Layout>
              <Footer style={{ textAlign: "center" }}>
                Do not CopyRights ©{new Date().getFullYear()}, All rights
                reserved
              </Footer>
            </Layout>
          </ConfigProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
