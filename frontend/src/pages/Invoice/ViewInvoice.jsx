import React from "react";
import { useParams } from "react-router-dom"; // Import useParams to access the URL params
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Divider, Table, Button } from "antd";
import { data as invoiceData } from "../../invoicesData";

function ViewInvoice() {
  // Get the invoice ID from the URL
  const { id } = useParams();

  // Example: Sample invoice details based on the ID
  //   const invoiceData = {
  //     key: "1",
  //     invoice_number: "INV-001",
  //     customer_name: "John Doe",
  //     invoice_date: "2024-10-01",
  //     amount: 250.75,
  //     status: "Paid",
  //     due_date: "2024-10-15",
  //   };

  // Sample product data for the invoice
  const productData = [
    {
      key: "1",
      product: "Product A",
      quantity: 10,
      price: 1000,
      total: 10000,
    },
    {
      key: "2",
      product: "Product B",
      quantity: 5,
      price: 500,
      total: 2500,
    },
  ];

  const totalAmount = productData.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <Button className="btn p-0" type="link">
            <ArrowLeftOutlined />
          </Button>
          <h6 className="m-0">Invoice No: {invoiceData.invoice_number}</h6>
        </div>
        <div className="d-flex gap-2">
          <Button className="btn btn-primary">
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
          <h4>{invoiceData.status}</h4>
        </div>
        <div className="d-flex flex-column">
          <h6 className="text-muted">Total</h6>
          <h4>₹{totalAmount.toFixed(2)}</h4>
        </div>
      </div>
      <Divider dashed />

      <div>
        <h6>Client Name: {invoiceData.customer_name}</h6>
        <div className="d-flex justify-content-between">
          <p className="text-muted">
            Address: <b>134, Avenue St. Luxemburg, UK.</b>
          </p>
          <p>
            Email: <b>example@example.com</b>
          </p>
          <p>
            Phone: <b>+91 9664846228</b>
          </p>
        </div>
      </div>

      <Table
        columns={[
          {
            title: "Product",
            dataIndex: "product",
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
