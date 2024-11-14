import mongoose from "mongoose";
const { Schema } = mongoose;

// Company Schema
const companySchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for company
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  website: { type: String },
  created_at: { type: Date, default: Date.now },
});

// Employee (User) Schema
const employeeSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for employee
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  position: {
    type: String,
    required: true,
  },
  salary: { type: Number, required: true }, // Employee's salary
  company_id: { type: Number, required: true }, // Numeric company ID
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date },
});

// Client Schema
const clientSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for client
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  website: { type: String },
  company_id: { type: Number, required: true }, // Numeric company ID
});

// Invoice Schema with Product IDs
const invoiceSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for invoice
  invoice_number: { type: String, required: true, unique: true },
  client_id: { type: Number, required: true }, // Numeric client ID
  company_id: { type: Number, required: true }, // Numeric company ID
  invoice_date: { type: Date, required: true },
  due_date: { type: Date, required: true },
  amount: { type: Number, required: true },
  pending_amount: { type: Number, required: true },
  status: {
    type: String,

    required: true,
  },
  products: [
    {
      id: { type: Number, required: true }, // Product ID (numeric, assuming a future product collection)
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true }, // Quantity * Price
    },
  ],
  payments: [{ type: Number, required: true }], // Payment IDs (numeric)
});

// Quote Schema with Product IDs
const quoteSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for quote
  quote_number: { type: String, required: true, unique: true },
  client_id: { type: Number, required: true }, // Numeric client ID
  company_id: { type: Number, required: true }, // Numeric company ID
  quote_date: { type: Date, required: true },
  expiration_date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Sent", "Accepted", "Declined"],
    default: "Sent",
  },
  products: [
    {
      id: { type: Number, required: true }, // Product ID (numeric)
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true }, // Quantity * Price
    },
  ],
});

// Payment Schema
const paymentSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for payment
  invoice_id: { type: Number, required: true }, // Numeric invoice ID
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // e.g., "Credit Card", "Bank Transfer", etc.
  reference_number: { type: String },
  company_id: { type: Number, required: true }, // Numeric company ID
});
const EmployeeLeavesSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for employee leaves
  employee_id: { type: Number, required: true }, // Numeric employee ID
  company_id: { type: Number, required: true }, // Numeric company ID
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
});

const EmployeeSalarySchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Numeric ID for employee salary
  employee_id: { type: Number, required: true }, // Numeric employee ID
  company_id: { type: Number, required: true }, // Numeric company ID
  salary: { type: Number, required: true },
});

// Create the Models
const Company = mongoose.model("Company", companySchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Client = mongoose.model("Client", clientSchema);
const Invoice = mongoose.model("Invoice", invoiceSchema);
const Quote = mongoose.model("Quote", quoteSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const EmployeeLeaves = mongoose.model("EmployeeLeaves", EmployeeLeavesSchema);
const EmployeeSalary = mongoose.model("EmployeeSalary", EmployeeSalarySchema);

// Export models
const dataModel = {
  Company,
  Employee,
  Client,
  Invoice,
  Quote,
  Payment,
  EmployeeLeaves,
  EmployeeSalary,
};

export default dataModel;
