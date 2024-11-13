import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardData,
  selectDashboardData,
  selectIsLoading,
  selectError,
} from "../redux/dataSlice";
import { Table, Progress } from "antd";

function Home() {
  const dispatch = useDispatch();

  const dashboardData = useSelector(selectDashboardData);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  const totalInvoices = dashboardData?.totalInvoice || 0;
  const draftInvoices = dashboardData?.draftInvoice || 0;
  const paidInvoices = dashboardData?.paidInvoice || 0;
  const pendingInvoices = dashboardData?.pendingInvoice || 0;

  const draftPercentage = totalInvoices
    ? (draftInvoices / totalInvoices) * 100
    : 0;
  const paidPercentage = totalInvoices
    ? (paidInvoices / totalInvoices) * 100
    : 0;
  const pendingPercentage = totalInvoices
    ? (pendingInvoices / totalInvoices) * 100
    : 0;

  const invoiceColumns = [
    {
      title: "Invoice No.",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 1:
            return "Sent";
          case 2:
            return "Paid";
          case 3:
            return "Pending";
          default:
            return "N/A";
        }
      },
    },
  ];

  // Columns for the Payments Table
  const paymentColumns = [
    { title: "Invoice Number", dataIndex: "invoice_id", key: "invoice_id" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Method", dataIndex: "method", key: "method" },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex gap-5 flex-wrap border p-4 bg-white rounded rounded-3">
        <div className="row w-100">
          <div className="col w-100 d-flex flex-column gap-2">
            <h4>Invoices</h4>
            <div className="flex flex-column gap-3">
              {/* Draft Invoices */}
              <p>Draft</p>
              <Progress
                percent={draftPercentage}
                strokeColor="gray"
                showInfo={false}
              />
              {/* Paid Invoices */}
              <p>Paid</p>
              <Progress
                percent={paidPercentage}
                strokeColor="green"
                showInfo={false}
              />
              {/* Pending Invoices */}
              <p>Pending</p>
              <Progress
                percent={pendingPercentage}
                strokeColor="orange"
                showInfo={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row gap-2">
        <h6>Recent Invoices</h6>
        <Table
          dataSource={dashboardData?.invoices || []}
          columns={invoiceColumns}
          rowKey="id"
          pagination={false}
        />
      </div>

      <h6>Recent Payments</h6>
      <Table
        dataSource={dashboardData?.payments || []}
        columns={paymentColumns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}

export default Home;
