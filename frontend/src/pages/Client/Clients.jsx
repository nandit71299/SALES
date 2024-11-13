import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import {
  fetchAllClients,
  selectAllClients,
  selectIsLoading,
  selectError,
} from "../../redux/dataSlice"; // Adjust path

function Clients() {
  const dispatch = useDispatch();
  const clients = useSelector(selectAllClients); // Get all clients from Redux state
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

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

  useEffect(() => {
    // Fetch all clients when the component is mounted
    dispatch(fetchAllClients());
  }, [dispatch]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Clients</h2>
      <Table
        dataSource={clients} // Use the clients data from Redux store
        columns={columns}
        rowKey="id" // Use the 'id' field as the row key
        scroll={{ x: "max-content" }}
        loading={isLoading}
      />
    </div>
  );
}

export default Clients;
