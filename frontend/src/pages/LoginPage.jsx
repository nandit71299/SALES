import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Card, Space, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/formSlice"; // Adjust the import path
import { selectFormState } from "../redux/formSlice"; // Adjust the import path

const LoginPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { isSubmitting, errors, authToken } = useSelector(
    selectFormState("login")
  );

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Dispatch login action with the form values
      const resultAction = await dispatch(login(values));
      console.log(resultAction.payload.success);
      if (resultAction.payload.success === true) {
        // Login succeeded, handle success
        message.success("Login successful");
        setTimeout(() => {
          window.location.href = "/"; // Redirect to another page after success
        }, 2000);
      } else {
        // If login failed, show error message
        message.error(resultAction.payload.form.message);
        sessionStorage.removeItem("authToken");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      // Redirect or perform other actions after login success (e.g., save token, navigate, etc.)
      console.log("Auth token:", authToken);
    }
  }, [authToken]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card title="Login" style={{ width: 400 }} bordered={false}>
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              type="email"
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading || isSubmitting}
              >
                Log in
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
