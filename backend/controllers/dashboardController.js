import dataModel from "../models/dataModel.js";

const Client = dataModel.Client;
const Invoice = dataModel.Invoice;
const Payment = dataModel.Payment;

export const getDashboard = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ invoice_date: -1 }).limit(5);
    const payments = await Payment.find().sort({ id: -1 }).limit(5);

    let draftInvoice = 0;
    let pendingInvoice = 0;
    let paidInvoice = 0;
    const totalInvoice = invoices.length;
    invoices.map((invoice) => {
      invoice.status == 1
        ? ++draftInvoice
        : invoice.status == 2
        ? ++paidInvoice
        : invoice.status == 3
        ? ++pendingInvoice
        : "";
    });

    const data = {
      invoices: invoices,
      payments: payments,
      totalInvoice: totalInvoice,
      draftInvoice: draftInvoice,
      pendingInvoice: pendingInvoice,
      paidInvoice: paidInvoice,
    };

    res.send(data);
    // console.log(Number(paidInvoice) * 100) / Number(totalInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
