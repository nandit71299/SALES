import mongoose from "mongoose";
const { Schema } = mongoose;

// Client Schema
const clientSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  website: { type: String },
});

// Invoice Schema with Product IDs
const invoiceSchema = new Schema({
  id: { type: Number, required: true },
  invoice_number: { type: String, required: true, unique: true },
  client_id: { type: Number, ref: "Client", required: true }, // client reference by ID
  invoice_date: { type: Date, required: true },
  due_date: { type: Date, required: true },
  amount: { type: Number, required: true },
  pending_amount: { type: Number, required: true },
  status: {
    type: Number,
    required: true,
  },
  products: [
    {
      id: { type: Number, required: true }, // Future reference to product collection
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true }, // Quantity * Price
    },
  ],
  payment_ids: [{ type: Number, ref: "Payment" }], // Reference to payment documents
});

// Quote Schema with Product IDs
const quoteSchema = new Schema({
  id: { type: Number, required: true },
  quote_number: { type: String, required: true, unique: true },
  client_id: { type: Schema.Types.ObjectId, ref: "Client", required: true }, // client reference by ID
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
      id: { type: Number, required: true }, // Future reference to product collection
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true }, // Quantity * Price
    },
  ],
});

// Payment Schema
const paymentSchema = new Schema({
  id: { type: Number, required: true },
  invoice_id: { type: Number, ref: "Invoice", required: true }, // reference to invoice
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // e.g., "Credit Card", "Bank Transfer", etc.
  reference_number: { type: String, required: false },
});

// Create the Models
const Client = mongoose.model("Client", clientSchema);
const Invoice = mongoose.model("Invoice", invoiceSchema);
const Quote = mongoose.model("Quote", quoteSchema);
const Payment = mongoose.model("Payment", paymentSchema);

// Optionally, you could define a Product model in the future
// const Product = mongoose.model("Product", productSchema);

// Export all models as a default export
const dataModel = {
  Client,
  Invoice,
  Quote,
  Payment,
};

export default dataModel;
