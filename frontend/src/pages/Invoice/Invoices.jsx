import React, { useEffect } from "react";
import { Table, Button, Spin, Alert } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInvoices } from "../../redux/dataSlice"; // Import fetchAllInvoices thunk
import {
  selectAllInvoices,
  selectIsLoading,
  selectError,
} from "../../redux/dataSlice"; // Import selectors

function Invoices() {
  const dispatch = useDispatch();

  // Get data from Redux state
  const invoices = useSelector(selectAllInvoices); // Get all invoices from state
  const isLoading = useSelector(selectIsLoading); // Get loading state from Redux
  const error = useSelector(selectError); // Get error state from Redux

  // Dispatch the fetchAllInvoices action on component mount
  useEffect(() => {
    dispatch(fetchAllInvoices());
  }, [dispatch]);

  // Columns for the invoice table
  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    {
      title: "Client Name",
      dataIndex: "client",
      key: "client_name",
      render: (client) => (client ? client.name : "N/A"), // Render client name
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
      key: "invoice_date",
      render: (text) => new Date(text).toLocaleDateString(), // Format invoice date
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `₹${text.toFixed(2)}`, // Format amount
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Paid" : "Pending"), // Map status codes to text
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (text) => new Date(text).toLocaleDateString(), // Format due date
    },
    {
      title: "Action", // Action column with the "View Invoice" button
      key: "action",
      render: (text, record) => (
        <Link to={`/view-invoice/${record.id}`}>
          <Button type="link">View Invoice</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h2>Invoices</h2>

      <Table
        dataSource={invoices}
        columns={columns}
        rowKey="id" // Use the invoice `id` as the row key
        scroll={{ x: "max-content" }} // Allow horizontal scrolling for wide tables
        loading={isLoading}
      />
    </div>
  );
}

export default Invoices;
