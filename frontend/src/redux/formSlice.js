import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define form names as constants
const FORM_NAMES = {
  INVOICE: "invoice",
  PAYMENT: "payment",
  CLIENT: "client",
  EMPLOYEE: "employee", // New form name for employee
};

// Initial state for all forms, including the new EMPLOYEE form
const initialState = {
  [FORM_NAMES.INVOICE]: {
    invoiceNumber: "",
    poNumber: "",
    invoiceDate: "",
    client: "",
    status: "",
    expiryDate: "",
    note: "",
    items: [],
  },
  [FORM_NAMES.PAYMENT]: {
    invoice: "",
    amount: "",
    paymentMode: "",
    referenceNo: "",
    description: "",
  },
  [FORM_NAMES.CLIENT]: {
    name: "",
    phone: "",
    email: "",
    website: "",
  },
  [FORM_NAMES.EMPLOYEE]: {
    // Initial state for employee
    name: "",
    email: "",
    salary: "",
    startDate: "",
    position: "",
  },
  isSubmitted: false,
  isSubmitting: false,
  errors: {
    [FORM_NAMES.INVOICE]: {
      invoiceNumber: "",
      poNumber: "",
      invoiceDate: "",
      client: "",
      status: "",
      expiryDate: "",
      note: "",
      items: "",
    },
    [FORM_NAMES.PAYMENT]: {
      invoice: "",
      amount: "",
      paymentMode: "",
      referenceNo: "",
      description: "",
      pending_amount: "",
    },
    [FORM_NAMES.CLIENT]: {
      name: "",
      phone: "",
      email: "",
      website: "",
    },
    [FORM_NAMES.EMPLOYEE]: {
      // Error state for employee
      name: "",
      email: "",
      salary: "",
      startDate: "",
      position: "",
    },
  },
};

// Helper function to get form state by name
const getFormState = (state, formName) => state.form[formName] || {};

// Async thunk for recording a payment
export const recordPayment = createAsyncThunk(
  "form/recordPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/payments/recordPayment",
        paymentData
      );
      if (response.data.success) {
        return response.data; // Return the success response data
      } else {
        return rejectWithValue({
          form: "An error occurred while recording the payment.",
        });
      }
    } catch (error) {
      return rejectWithValue({
        form: error.response ? error.response.data : error.message,
      });
    }
  }
);

// Async thunk for creating an invoice
export const createInvoice = createAsyncThunk(
  "form/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/invoices/create",
        invoiceData
      );
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue({
          form: "An error occurred while creating the invoice.",
        });
      }
    } catch (error) {
      return rejectWithValue({
        form: error.response ? error.response.data : error.message,
      });
    }
  }
);

// Async thunk for submitting a client
export const submitClient = createAsyncThunk(
  "form/submitClient",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/client/createClient",
        formData
      );
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue({
          form: "An error occurred while creating the client.",
        });
      }
    } catch (error) {
      return rejectWithValue({
        form: error.response ? error.response.data : error.message,
      });
    }
  }
);

// Async thunk for creating an employee
export const createEmployee = createAsyncThunk(
  "form/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/employees/create",
        employeeData
      );
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue({
          form: "An error occurred while creating the employee.",
        });
      }
    } catch (error) {
      return rejectWithValue({
        form: error.response ? error.response.data : error.message,
      });
    }
  }
);

// Redux slice for managing form state
const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFieldValue: (state, action) => {
      const { formName, field, value } = action.payload;
      if (formName === FORM_NAMES.INVOICE && field === "items") {
        state[formName][field] = value;
      } else {
        state[formName][field] = value;
      }
    },
    setSubmitting: (state) => {
      state.isSubmitting = true;
      state.errors = {};
    },
    setSubmitted: (state) => {
      state.isSubmitting = false;
      state.isSubmitted = true;
    },
    setError: (state, action) => {
      const { formName, field, message } = action.payload;
      if (
        state.errors[formName] &&
        typeof state.errors[formName] === "object"
      ) {
        state.errors[formName][field] = message;
      } else {
        console.error(`Error state for ${formName} is not an object.`);
      }
    },
    resetForm: (state, action) => {
      const { formName } = action.payload;
      state[formName] = initialState[formName];
    },
    resetAllForms: (state) => {
      return initialState;
    },
    addItem: (state) => {
      const newItem = {
        id: state[FORM_NAMES.INVOICE].items.length + 1,
        name: "",
        quantity: 0,
        price: 0,
        total: 0,
      };
      state[FORM_NAMES.INVOICE].items.push(newItem);
    },
    removeItem: (state, action) => {
      const { key } = action.payload;
      state[FORM_NAMES.INVOICE].items = state[FORM_NAMES.INVOICE].items.filter(
        (item) => item.key !== key
      );
    },
    updateItem: (state, action) => {
      const { key, field, value } = action.payload;
      const item = state[FORM_NAMES.INVOICE].items.find(
        (item) => item.key === key
      );
      if (item) {
        item[field] = value;
        if (field === "quantity" || field === "price") {
          item.total = item.quantity * item.price;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitClient.pending, (state) => {
        state.isSubmitting = true;
        state.errors = {};
      })
      .addCase(submitClient.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSubmitted = true;
      })
      .addCase(submitClient.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors[FORM_NAMES.CLIENT] = action.payload;
      })
      .addCase(createInvoice.pending, (state) => {
        state.isSubmitting = true;
        state.errors = {};
      })
      .addCase(createInvoice.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSubmitted = true;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors[FORM_NAMES.INVOICE] = action.payload;
      })
      .addCase(recordPayment.pending, (state) => {
        state.isSubmitting = true;
        state.errors = {};
      })
      .addCase(recordPayment.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSubmitted = true;
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors[FORM_NAMES.PAYMENT] = action.payload;
      })
      // Handling the employee async operations
      .addCase(createEmployee.pending, (state) => {
        state.isSubmitting = true;
        state.errors = {};
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSubmitted = true;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors[FORM_NAMES.EMPLOYEE] = action.payload;
      });
  },
});

// Export actions for use in components
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

// Selector for getting form state by name
export const selectFormState = (formName) => (state) =>
  getFormState(state, formName);

export const selectEmployeeState = (state) =>
  getFormState(state, FORM_NAMES.EMPLOYEE);

// Export the reducer
export default formSlice.reducer;
