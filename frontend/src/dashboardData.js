export const data = {
  invoices: [
    { label: "This Month", amount: "₹600.00" },
    { label: "Last Month", amount: "₹450.00" },
    { label: "This Month", amount: "₹300.00" },
    { label: "Last Month", amount: "₹1200.00" },
  ],
  progress: [
    { category: "Invoices", status: "Draft", percentage: 55, color: "green" },
    { category: "Invoices", status: "Pending", percentage: 25, color: "red" },
    {
      category: "Invoices",
      status: "Paid",
      percentage: 80,
      color: "green",
    },
    { category: "Quotes", status: "Draft", percentage: 40, color: "#ffc107" },
    { category: "Quotes", status: "Pending", percentage: 55, color: "red" },
    {
      category: "Quotes",
      status: "Sent",
      percentage: 55,
      color: "#17a2b8!important",
    },
  ],
  recent: {
    invoices: [
      { no: 1, client: "Test Client", total: "₹300", status: "Pending" },
      { no: 2, client: "Test Client", total: "₹600", status: "Paid" },
      { no: 3, client: "Test Client", total: "₹600", status: "Sent" },
    ],
    quotes: [
      { no: 1, client: "Test Client", total: "₹500", status: "Sent" },
      { no: 2, client: "Test Client", total: "₹900", status: "Sent" },
      { no: 3, client: "Test Client", total: "₹900", status: "Sent" },
    ],
  },
};
