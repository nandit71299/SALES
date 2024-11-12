import React from "react";
import { Table } from "antd";
import { data } from "../../clientsData"; // Import your clients data

function Clients() {
  // Columns for the table
  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["xs", "lg"], // Show on small screens and above
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ), // Render website as a clickable link
      responsive: ["xs", "lg"], // Show on small screens and above
    },
  ];

  return (
    <div>
      <h2>Clients</h2>
      <Table
        dataSource={data.clients} // Access the 'clients' array from the imported data
        columns={columns}
        rowKey="id" // Use the 'id' field as the row key
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default Clients;
