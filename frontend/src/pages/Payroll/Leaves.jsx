import React, { useEffect } from "react";
import { Table, Spin, Alert, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllLeaves } from "../../redux/dataSlice"; // Make sure to import the correct action

function Leaves() {
  const dispatch = useDispatch();

  const { allEmployees, isLoading, error } = useSelector((state) => state.data);

  useEffect(() => {
    // Fetch all employee leaves when the component mounts
    dispatch(fetchAllLeaves());
    if (allEmployees.length < 1) {
      message.info("No Leaves found");
    }
  }, [dispatch]);

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
    },
    {
      title: "Employee Name",
      dataIndex: "employee_details",
      key: "employee_name",
      render: (employee_details) => employee_details?.name || "NA",
    },
    {
      title: "Leave Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Leave End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
  ];

  // Render the table or an error/loading message
  return (
    <div>
      <h2>Employees</h2>

      {isLoading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Table
          dataSource={allEmployees} // Populate the table with the employee leaves data
          columns={columns}
          rowKey={(record, index) => index} // Use index as the unique key
          pagination={{ pageSize: 10 }} // Pagination for the table
          loading={isLoading}
        />
      )}
    </div>
  );
}

export default Leaves;
