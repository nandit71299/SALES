import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Payments from "./pages/Payment/Payments";
import Invoices from "./pages/Invoice/Invoices";
import CreateInvoice from "./pages/Invoice/CreateInvoice";
import RecordPayment from "./pages/Payment/RecordPayment";
import Clients from "./pages/Client/Clients";
import CreateClient from "./pages/Client/CreateClient";
import ViewInvoice from "./pages/Invoice/ViewInvoice";
import Employees from "./pages/Payroll/Employees";
import CreateEmployee from "./pages/Payroll/CreateEmployee";
import Leaves from "./pages/Payroll/Leaves";
import AddLeave from "./pages/Payroll/AddLeave";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./PrivateRoutes"; // Import the PrivateRoute component

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes (Login) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes (Dashboard and everything else) */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route path="/" element={<Home />} />
              <Route path="payments" element={<Payments />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="create-invoice" element={<CreateInvoice />} />
              <Route path="record-payment" element={<RecordPayment />} />
              <Route path="clients" element={<Clients />} />
              <Route path="create-client" element={<CreateClient />} />
              <Route path="view-invoice/:id" element={<ViewInvoice />} />
              <Route path="employees" element={<Employees />} />
              <Route path="create-employee" element={<CreateEmployee />} />
              <Route path="leaves" element={<Leaves />} />
              <Route path="addleave" element={<AddLeave />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  </StrictMode>
);
