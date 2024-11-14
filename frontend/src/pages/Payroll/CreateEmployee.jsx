import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  notification,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmployee,
  setFieldValue,
  resetForm,
  selectEmployeeState,
} from "../../redux/formSlice"; // Adjust the import path for your slice
import moment from "moment";

const { Option } = Select;

function CreateEmployee() {
  const dispatch = useDispatch();
  const employeeState = useSelector(selectEmployeeState); // Select employee form state from Redux
  const [loading, setLoading] = useState(false);

  // Set the form values from Redux state to local state (for form initialization)
  const [formValues, setFormValues] = useState({
    name: employeeState.name || "",
    email: employeeState.email || "",
    salary: employeeState.salary || "",
    startDate: employeeState.startDate || "",
    position: employeeState.position || "",
  });

  // Update form values when the employee state in Redux changes
  useEffect(() => {
    setFormValues({
      name: employeeState.name || "",
      email: employeeState.email || "",
      salary: employeeState.salary || "",
      startDate: employeeState.startDate || "",
      position: employeeState.position || "",
      password: employeeState.password || "",
    });
  }, [employeeState]);

  // Handle input field change and dispatch updated values to Redux
  const handleFieldChange = (field, value) => {
    dispatch(setFieldValue({ formName: "employee", field, value }));
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Dispatch the createEmployee async action to save employee data
      const resultAction = await dispatch(createEmployee(values));

      // Check if the action was fulfilled (successful)
      if (createEmployee.fulfilled.match(resultAction)) {
        setLoading(false);
        dispatch(resetForm({ formName: "employee" })); // Optionally reset the form after success
        message.success("The employee has been successfully created");

        console.log("HERE");
        // Redirect after a delay
        setTimeout(() => {
          window.location.href = "/employees"; // Redirect to employees page after submission
        }, 2000);
      } else {
        setLoading(false);
        // Handle failure case from the rejected action
        notification.error({
          message: "Error",
          description:
            resultAction.payload?.form.message ||
            "Something went wrong while creating the employee.",
        });
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Error",
        description:
          error?.message || "Something went wrong while creating the employee.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Employee</h2>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          name: formValues.name,
          email: formValues.email,
          salary: formValues.salary,
          startDate: formValues.startDate ? moment(formValues.startDate) : null,
          position: formValues.position,
          password: formValues.password,
        }}
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the employee's name" },
          ]}
        >
          <Input
            value={formValues.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Enter employee's name"
          />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter the employee's email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            value={formValues.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="Enter employee's email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter the password" },
            { type: "password", message: "Please enter a valid password" },
          ]}
        >
          <Input
            type="password"
            value={formValues.password}
            onChange={(e) => handleFieldChange("password", e.target.value)}
            placeholder="Enter employee's password"
          />
        </Form.Item>

        {/* Salary Field */}
        <Form.Item
          label="Salary"
          name="salary"
          rules={[
            { required: true, message: "Please enter the employee's salary" },
          ]}
        >
          <Input
            type="number"
            value={formValues.salary}
            onChange={(e) => handleFieldChange("salary", e.target.value)}
            placeholder="Enter employee's salary"
            min={0}
          />
        </Form.Item>

        {/* Start Date Field */}
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[
            {
              required: true,
              message: "Please select the employee's start date",
            },
          ]}
        >
          <DatePicker
            value={formValues.startDate ? moment(formValues.startDate) : null}
            onChange={(date, dateString) =>
              handleFieldChange("startDate", dateString)
            }
            format="YYYY-MM-DD"
            placeholder="Select start date"
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* Position Field */}
        <Form.Item
          label="Position"
          name="position"
          rules={[
            {
              required: true,
              message: "Please select the employee's position",
            },
          ]}
        >
          <Select
            value={formValues.position}
            onChange={(value) => handleFieldChange("position", value)}
            placeholder="Select a position"
          >
            <Option value="developer">Developer</Option>
            <Option value="designer">Designer</Option>
            <Option value="manager">Manager</Option>
            <Option value="qa">QA</Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Create Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateEmployee;
