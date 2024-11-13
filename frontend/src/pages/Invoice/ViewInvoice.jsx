import React, { useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access the URL params
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Divider, Table, Button, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoiceData,
  selectIndividualInvoice,
  selectIsLoading,
  selectError,
} from "../../redux/dataSlice"; // Import the necessary actions and selectors

function ViewInvoice() {
  // Get the invoice ID from the URL
  const { id } = useParams();
  const dispatch = useDispatch();

  // Select the state for individual invoice, loading and error
  const invoiceData = useSelector(selectIndividualInvoice);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  console.log(invoiceData);
  // Fetch the invoice data on component mount
  useEffect(() => {
    dispatch(fetchInvoiceData(id));
  }, [dispatch, id]);

  // If the invoice data is being fetched, show a loading spinner
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Handle any errors that occur during the fetch
  if (error) {
    message.error("Failed to load invoice data: " + error);
    return <div>Something went wrong. Please try again later.</div>;
  }

  // If no invoice data is found, show a message
  if (!invoiceData) {
    return <div>No invoice found with this ID.</div>;
  }

  // Sample product data for the invoice (replace with actual data from API)
  const productData = invoiceData.products || []; // Assuming items array is present in invoiceData
  const totalAmount = productData.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <Button className="btn p-0" type="link">
            <ArrowLeftOutlined
              onClick={() => {
                window.location = "/invoices";
              }}
            />
          </Button>
          <h6 className="m-0">Invoice No: {invoiceData.invoice_number}</h6>
        </div>
        <div className="d-flex gap-2">
          <Button
            className="btn btn-primary"
            onClick={() =>
              (window.location = `http://localhost:3000/api/invoices/generatePdf/${id}`)
            }
          >
            <FilePdfOutlined /> Download PDF
          </Button>
          <Button className="btn btn-outline-dark">
            <MailOutlined /> Send By Email
          </Button>
        </div>
      </div>

      <div className="d-flex gap-5 justify-content-start align-items-center">
        <div className="d-flex flex-column">
          <h6 className="text-muted">Status</h6>
          <h4>
            {invoiceData.status == 1
              ? "Sent"
              : invoiceData.status == 2
              ? "Paid"
              : invoiceData.status == 3
              ? "Cancelled"
              : "Unknown"}
          </h4>
        </div>
        <div className="d-flex flex-column">
          <h6 className="text-muted">Total</h6>
          <h4>₹{invoiceData.amount.toFixed(2)}</h4>
        </div>
      </div>
      <Divider dashed />

      <div>
        <h6>Client Name: {invoiceData.client.name}</h6>
        <div className="d-flex justify-content-between">
          <p>
            Email: <b>{invoiceData.client.email}</b>
          </p>
          <p>
            Phone:{" "}
            <b>{invoiceData?.client?.phone ? invoiceData.client.phone : "-"}</b>
          </p>
        </div>
      </div>

      <Table
        columns={[
          {
            title: "Product",
            dataIndex: "name",
            key: "product",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (text) => `₹${text.toFixed(2)}`,
          },
          {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "right",
            render: (text) => `₹${text.toFixed(2)}`,
          },
        ]}
        dataSource={productData}
        pagination={false}
        bordered
        rowKey="key"
        footer={() => (
          <div className="d-flex justify-content-end">
            <strong>Total:</strong> ₹{totalAmount.toFixed(2)}
          </div>
        )}
      />
    </div>
  );
}

export default ViewInvoice;
