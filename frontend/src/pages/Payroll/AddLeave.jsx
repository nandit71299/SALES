import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  setFieldValue,
  createEmployeeLeave,
  setSubmitted,
} from "../../redux/formSlice";
import { fetchAllEmployees } from "../../redux/dataSlice"; // Import the action

function AddLeave() {
  const dispatch = useDispatch();
  const { employee_leaves, isSubmitting, isSubmitted, errors } = useSelector(
    (state) => state.form
  );
  const { allEmployees, isLoading } = useSelector((state) => state.data); // Get all employees and loading state

  // Dispatch action to fetch employees when the component mounts
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  // Handle field change to update Redux store
  const handleFieldChange = (field, value) => {
    if (employee_leaves) {
      if (field === "startDate" || field === "endDate") {
        dispatch(
          setFieldValue({
            formName: "employee_leaves",
            field,
            value: value.toISOString(),
          })
        );
      } else {
        dispatch(setFieldValue({ formName: "employee_leaves", field, value }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const leaveData = {
      employee_id: values.employee_id,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
      reason: values.reason,
    };

    // Dispatch action to create employee leave
    dispatch(createEmployeeLeave(leaveData))
      .unwrap()
      .then(() => {
        // On success, show success message and set form to submitted
        message.success("Leave Recorded Successfully");

        setTimeout(() => {
          dispatch(setSubmitted());
          window.location.href = "/leaves"; // Redirect to another page after success
        }, 2000);
      })
      .catch((err) => {
        // On failure, show error message
        console.log(err);
        message.error(
          err?.message || "An error occurred while recording payment."
        );
        dispatch(
          setError({
            formName: "payment",
            field: "form",
            message: "An error occurred during payment recording.",
          })
        );
      });
    // If needed, handle success/error messages
    if (isSubmitted) {
      message.success("Leave Recorded!");
      setTimeout(() => {
        window.location.href = "/leaves"; // Redirect to employee leaves page after submission
      }, 2000);
    } else if (errors.EMPLOYEE_LEAVES) {
      message.error(errors.EMPLOYEE_LEAVES);
    }
  };

  useEffect(() => {
    if (errors.EMPLOYEE_LEAVES) {
      message.error(errors.EMPLOYEE_LEAVES);
    }
  }, [isSubmitted, errors]);

  if (isLoading) {
    return <Spin />;
  }

  if (!employee_leaves) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Add Leave</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        {/* Employee Select */}
        <Form.Item
          name="employee_id"
          label="Employee"
          rules={[{ required: true, message: "Please select an employee" }]}
        >
          <Select
            placeholder="Select an employee"
            value={employee_leaves.employee_id}
            onChange={(value) => {
              handleFieldChange("employee_id", value);
            }}
          >
            {allEmployees?.length > 0 &&
              allEmployees.map((employee) => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            value={moment(employee_leaves.startDate)}
            onChange={(date) => handleFieldChange("startDate", date)}
          />
        </Form.Item>

        {/* End Date */}
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "Please select an end date" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            value={moment(employee_leaves.endDate)}
            onChange={(date) => handleFieldChange("endDate", date)}
          />
        </Form.Item>

        {/* Reason Textarea */}
        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: "Please provide a reason" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Reason for leave"
            value={employee_leaves.reason}
            onChange={(e) => handleFieldChange("reason", e.target.value)}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddLeave;
