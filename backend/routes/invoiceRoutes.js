import express from "express";
import {
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generatePdf,
} from "../controllers/invoiceController.js";
const router = express.Router();

// Define routes for invoices
router.get("/getall", getInvoices); // Get all invoices
router.get("/:id", getInvoiceById); // Get invoice by ID
router.post("/create", createInvoice); // Create a new invoice
router.put("/:id", updateInvoice); // Update invoice by ID
router.delete("/:id", deleteInvoice); // Delete invoice by ID
router.get("/generatePdf/:id", generatePdf); // Delete invoice by ID

export default router;
