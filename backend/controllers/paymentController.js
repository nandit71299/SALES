import dataModel from "../models/dataModel.js";
import { genNextSequenceValue } from "../utils/sequenceGenerator.js";

const { Invoice, Payment } = dataModel;

// Controller function to record payment
export const recordPayment = async (req, res) => {
  try {
    const { invoice_id, amount, payment_mode, reference_number } = req.body;

    // Step 1: Validate input
    if (!invoice_id || !amount || !payment_mode || !reference_number) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Step 2: Fetch the invoice by its ID and check its validity
    const invoice = await Invoice.findOne({ id: invoice_id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Check if the invoice is already fully paid
    if (invoice.status === "Paid") {
      return res
        .status(400)
        .json({ message: "This invoice is already fully paid." });
    }

    // Check if the payment amount is valid
    if (amount <= 0 || amount > invoice.amount) {
      return res.status(400).json({ message: "Invalid payment amount." });
    }

    // Step 3: Generate the next payment ID
    const paymentId = await genNextSequenceValue("payment_sequence");

    // Step 4: Create the new payment record
    const newPayment = new Payment({
      id: paymentId,
      invoice_id: invoice.id,
      amount,
      method: payment_mode,
      reference_number,
    });

    // Step 5: Save the payment record
    await newPayment.save();

    // Step 6: Update the invoice status and amount if necessary

    invoice.pending_amount -= amount; // Subtract the payment from the invoice balance
    if (invoice.pending_amount === 0) {
      invoice.status = 2; // Mark the invoice as paid
    }
    invoice.payment_ids.push(paymentId);
    await invoice.save();
    // Step 7: Return the success response with payment details
    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully.",
      payment: newPayment,
      updatedInvoice: invoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAll = async (req, res) => {
  try {
    const payments = await Payment.find();
    return res.json(payments);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error.", error: err.message });
  }
};
