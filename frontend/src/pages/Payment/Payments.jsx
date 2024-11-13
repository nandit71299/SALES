import React, { useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPayments } from "../../redux/dataSlice"; // Ensure correct import path
import {
  selectAllPayments,
  selectIsLoading,
  selectError,
} from "../../redux/dataSlice";

function Payments() {
  const dispatch = useDispatch();
  const payments = useSelector(selectAllPayments);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Dispatch the action to fetch all payments when the component mounts
  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  // Columns for the table
  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoice_id",
      key: "invoice_id",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `₹${text.toFixed(2)}`, // Format as currency
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Payment Method",
      dataIndex: "method",
      key: "method",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Reference Number",
      dataIndex: "reference_number",
      key: "reference_number",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
  ];

  // If the data is loading, show a loading spinner
  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  // If there is an error, show an error message
  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <h2>Payments</h2>
      <Table
        dataSource={payments}
        columns={columns}
        rowKey="_id" // Make sure the row has a unique key
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default Payments;
