import { createSlice } from "@reduxjs/toolkit";

// Initial state for each form
const initialState = {
  invoice: {
    invoiceNumber: "",
    poNumber: "",
    invoiceDate: "",
    client: "",
    status: "",
    expiryDate: "",
    note: "",
    items: [{ key: 1, item: "", quantity: 0, price: 0, total: 0 }], // Initialize with one empty item
  },
  payment: {
    invoice: "",
    amount: "",
    paymentMode: "",
    referenceNo: "",
    description: "",
  },
  client: {
    name: "",
    phone: "",
    email: "",
    website: "",
  },
  isSubmitted: false,
  isSubmitting: false,
  errors: {
    invoice: {
      invoiceNumber: "",
      poNumber: "",
      invoiceDate: "",
      client: "",
      status: "",
      expiryDate: "",
      note: "",
      items: "",
    },
    payment: {
      invoice: "",
      amount: "",
      paymentMode: "",
      referenceNo: "",
      description: "",
    },
    client: {
      name: "",
      phone: "",
      email: "",
      website: "",
    },
  },
};

// Helper function to get form state by name
const getFormState = (state, formName) => state.form[formName] || {};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    // Set specific field value for a specific form
    setFieldValue: (state, action) => {
      const { formName, field, value } = action.payload;
      if (formName === "invoice" && field === "items") {
        // If it's items, we need to update the array of items
        state[formName][field] = value;
      } else {
        state[formName][field] = value;
      }
    },

    // Set submitting state
    setSubmitting: (state) => {
      state.isSubmitting = true;
      state.errors = {}; // Clear previous errors
    },

    // Set form submitted state
    setSubmitted: (state) => {
      state.isSubmitting = false;
      state.isSubmitted = true;
    },

    // Set error message for a specific field
    setError: (state, action) => {
      const { formName, field, message } = action.payload;
      state.errors[formName][field] = message;
    },

    // Reset form state by form name
    resetForm: (state, action) => {
      const { formName } = action.payload;
      state[formName] = initialState[formName]; // Reset the specific form
    },

    // Reset all forms to their initial states
    resetAllForms: (state) => {
      return initialState;
    },

    // Add a new item to the invoice
    addItem: (state) => {
      const newItem = {
        key: state.invoice.items.length + 1,
        item: "",
        quantity: 0,
        price: 0,
        total: 0,
      };
      state.invoice.items.push(newItem);
    },

    // Remove an item from the invoice
    removeItem: (state, action) => {
      const { key } = action.payload;
      state.invoice.items = state.invoice.items.filter(
        (item) => item.key !== key
      );
    },

    // Update an item field (e.g., item name, quantity, price)
    updateItem: (state, action) => {
      const { key, field, value } = action.payload;
      const item = state.invoice.items.find((item) => item.key === key);
      if (item) {
        item[field] = value;

        // If quantity or price changes, update the total
        if (field === "quantity" || field === "price") {
          item.total = item.quantity * item.price;
        }
      }
    },
  },
});

// Actions
export const {
  setFieldValue,
  setSubmitting,
  setSubmitted,
  setError,
  resetForm,
  resetAllForms,
  addItem,
  removeItem,
  updateItem,
} = formSlice.actions;

// Selector to get the form state
export const selectFormState = (formName) => (state) =>
  getFormState(state, formName);

export default formSlice.reducer;
