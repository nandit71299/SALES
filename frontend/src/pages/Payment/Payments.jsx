import React from "react";
import { Table } from "antd";
import { data } from "../../paymentsData";
function Payments() {
  // Columns for the table
  const columns = [
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
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
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Reference Number",
      dataIndex: "reference_number",
      key: "reference_number",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
  ];

  return (
    <div>
      <h2>Payments</h2>
      <Table
        dataSource={data}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default Payments;
