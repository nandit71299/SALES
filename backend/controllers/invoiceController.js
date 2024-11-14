// const Invoice = require("../models/dataModel");
import dataModel from "../models/dataModel.js";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs"; // To save the PDF to the server for inspection (optional)

import { genNextSequenceValue } from "../utils/sequenceGenerator.js";
const Invoice = dataModel.Invoice;
const Client = dataModel.Client;
// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    // Step 1: Fetch all invoices
    const invoices = await Invoice.find({ company_id: req.query.company_id });

    // Step 2: For each invoice, fetch the corresponding client data
    const invoicesWithClientData = await Promise.all(
      invoices.map(async (invoice) => {
        // Fetch client by ID (Note: We use .findOne() instead of .find() here)
        const client = await Client.findOne({ id: Number(invoice.client_id) });

        // Step 3: If no client is found, throw an error
        if (!client) {
          throw new Error(`Client with ID ${invoice.client_id} not found`);
        }

        // Merge client data with the invoice data
        return {
          ...invoice.toObject(), // Convert Mongoose document to a plain object
          client, // Add client data to invoice
        };
      })
    );

    // Step 4: Send the merged data to the frontend
    res.status(200).json(invoicesWithClientData);
  } catch (err) {
    // If any error occurs (including client not found), send an error response
    res.status(404).json({ message: "Client not found", error: err.message });
  }
};

// Create a new invoice
export const createInvoice = async (req, res) => {
  const {
    invoice_number,
    client_id,
    amount,
    status,
    due_date,
    invoice_date,
    items,
    company_id,
  } = req.body;

  if (
    !invoice_number ||
    !client_id ||
    !amount ||
    !status ||
    !due_date ||
    !invoice_date ||
    !company_id
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existingInvoice = await Invoice.findOne({ invoice_number });
  if (existingInvoice) {
    return res.status(400).json({ message: "Invoice number already exists" });
  }

  try {
    const newInvoice = new Invoice({
      id: await genNextSequenceValue("invoice"),
      invoice_number: invoice_number,
      client_id: Number(client_id),
      amount: amount.toFixed(2),
      status: Number(status),
      due_date: new Date(due_date),
      invoice_date: new Date(invoice_date),
      products: items,
      pending_amount: amount.toFixed(2),
      company_id: Number(company_id),
    });

    await newInvoice.save();
    res.status(200).json({
      success: true,
      message: "Invoice created successfully",
      data: newInvoice,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Fetch the invoice by ID
    const invoice = await Invoice.findOne({ id: id }); // Use .findOne() since we are looking for a single document
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Step 2: Fetch the client associated with the invoice
    const client = await Client.findOne({ id: Number(invoice.client_id) });
    if (!client) {
      return res
        .status(404)
        .json({ message: `Client with ID ${invoice.client_id} not found` });
    }

    // Step 3: Merge the client data with the invoice data
    const invoiceWithClientData = {
      ...invoice.toObject(), // Convert Mongoose document to plain object
      client, // Add the client data to the invoice
    };

    // Step 4: Send the merged data in the response
    res.status(200).json({
      success: true,
      message: "OK",
      data: invoiceWithClientData,
    });
  } catch (err) {
    // If any error occurs, handle the error and send a response
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { invoice_number, customer_name, amount, status, due_date } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        invoice_number,
        customer_name,
        amount,
        status,
        due_date,
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const generatePdf = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the data is coming from the client in the request body

    // Step 1: Fetch the invoice data
    const invoice = await Invoice.findOne({ id: id }); // Use .findOne() since we are looking for a single document
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Step 2: Fetch the client associated with the invoice
    const client = await Client.findOne({ id: Number(invoice.client_id) });
    if (!client) {
      return res
        .status(404)
        .json({ message: `Client with ID ${invoice.client_id} not found` });
    }

    // Step 3: Merge the client data with the invoice data
    const invoiceData = {
      ...invoice.toObject(), // Convert Mongoose document to plain object
      client, // Add the client data to the invoice
    };

    // Step 4: Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page to the document
    const page = pdfDoc.addPage([600, 850]);
    const { width, height } = page.getSize();

    // Set some basic fonts and text settings
    const font = await pdfDoc.embedFont("Helvetica");
    const fontSize = 12;

    // Title of the invoice
    page.drawText("Invoice", {
      x: 50,
      y: height - 50,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });

    // Invoice Number
    page.drawText(`Invoice Number: ${invoiceData.invoice_number}`, {
      x: 50,
      y: height - 100,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Client Details
    page.drawText(`Client: ${invoiceData.client.name}`, {
      x: 50,
      y: height - 130,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Phone: ${invoiceData.client.phone}`, {
      x: 50,
      y: height - 150,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Email: ${invoiceData.client.email}`, {
      x: 50,
      y: height - 170,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Invoice Date and Amount
    page.drawText(
      `Invoice Date: ${new Date(
        invoiceData.invoice_date
      ).toLocaleDateString()}`,
      {
        x: 300,
        y: height - 100,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      }
    );

    page.drawText(`Total Amount: $${invoiceData.amount.toFixed(2)}`, {
      x: 300,
      y: height - 130,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Draw a line separator
    page.drawLine({
      start: { x: 50, y: height - 180 },
      end: { x: width - 50, y: height - 180 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Draw Product Table Headers
    const tableStartY = height - 210;
    const rowHeight = 25;
    page.drawText("Product Name", {
      x: 50,
      y: tableStartY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Price", {
      x: 200,
      y: tableStartY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Quantity", {
      x: 300,
      y: tableStartY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Total", {
      x: 400,
      y: tableStartY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Draw Product Rows
    const products = invoiceData.products;
    let yPosition = tableStartY - rowHeight;

    products.forEach((product) => {
      page.drawText(product.name, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${product.price.toFixed(2)}`, {
        x: 200,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${product.quantity}`, {
        x: 300,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${product.total.toFixed(2)}`, {
        x: 400,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= rowHeight;
    });

    // Step 5: Save the document to bytes
    const pdfBytes = await pdfDoc.save();
    // Convert Uint8Array to Buffer before sending
    const pdfBuffer = Buffer.from(pdfBytes);
    res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.send(pdfBuffer);

    // Step 6: Set appropriate headers for PDF download
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      message: "Internal server error while generating PDF",
      error: error.message,
    });
  }
};
