import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import hooks to connect with Redux
import { fetchAllEmployees } from "../../redux/dataSlice"; // Import your Redux action
import { Table, Spin, message } from "antd"; // Import Ant Design components

function Employees() {
  const dispatch = useDispatch();

  // Selecting data and loading/error state from Redux store
  const { allEmployees, isLoading, error } = useSelector((state) => state.data);

  // Columns for the Table component
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(), // Format the date
    },
  ];

  // Fetching employee data on component mount
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  // Handle errors if any
  useEffect(() => {
    if (error) {
      message.error("Failed to load employees: " + error);
    }
  }, [error]);

  return (
    <div>
      <h2>Employees</h2>
      {isLoading ? (
        <Spin /> // Show a loading spinner while data is fetching
      ) : (
        <Table
          dataSource={allEmployees}
          columns={columns}
          rowKey="id" // Unique identifier for each row, use 'id' from your employee data
        />
      )}
    </div>
  );
}

export default Employees;
