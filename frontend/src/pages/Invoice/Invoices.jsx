import React from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { data } from "../../invoicesData";

function Invoices() {
  // Columns for the table
  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
      key: "invoice_number",
      responsive: ["xs", "lg"],
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      responsive: ["xs", "lg"],
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
      key: "invoice_date",
      render: (text) => new Date(text).toLocaleDateString(),
      responsive: ["xs", "lg"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `₹${text.toFixed(2)}`,
      responsive: ["xs", "lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["xs", "lg"],
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (text) => new Date(text).toLocaleDateString(),
      responsive: ["xs", "lg"],
    },
    {
      title: "Action", // New column for the "View Invoice" button
      key: "action",
      render: (text, record) => (
        <Link to={`/view-invoice/${record.key}`}>
          <Button type="link">View Invoice</Button>
        </Link>
      ),
      responsive: ["xs", "lg"],
    },
  ];

  return (
    <div>
      <h2>Invoices</h2>
      <Table
        dataSource={data}
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey="key" // Ensure each row has a unique key
      />
    </div>
  );
}

export default Invoices;
