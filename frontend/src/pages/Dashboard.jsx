import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  CopyOutlined,
  DollarOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";

const { Sider, Content } = Layout;

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = ({ key }) => {
    console.log(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        theme="light"
        className="site-layout-background"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
        }}
      >
        <div className="logo d-flex align-items-center justify-content-center">
          <h1
            style={{
              fontSize: collapsed ? "22px" : "36px",
              transition: "font-size 0.8s ease-in-out",
            }}
          >
            Logo
          </h1>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Divider />
          <Menu.SubMenu key="sub1" icon={<DollarOutlined />} title="Payments">
            <Menu.Item key="2" icon={"₹"}>
              <Link to="/payments" style={{ marginLeft: "12px" }}>
                Payments
              </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={"₹"}>
              <Link to="/record-payment" style={{ marginLeft: "12px" }}>
                Record Payment
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />

          <Menu.SubMenu key="sub2" icon={<CopyOutlined />} title="Invoicing">
            <Menu.Item key="4">
              <Link to="/invoices">Invoices</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/create-invoice">Create Invoice</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="sub3" icon={<UserAddOutlined />} title="Clients">
            <Menu.Item key="6">
              <Link to="/clients">All Clients</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/create-client">Add Client</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? "80px" : "250px" }}>
        <Content
          style={{
            padding: "24px",
            marginTop: "30px",
            minHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
