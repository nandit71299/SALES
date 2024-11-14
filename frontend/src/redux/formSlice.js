import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define form names as constants
const FORM_NAMES = {
  INVOICE: "invoice",
  PAYMENT: "payment",
  CLIENT: "client",
  EMPLOYEE: "employee", // New form name for employee
  EMPLOYEE_LEAVES: "employee_leaves",
  EMPLOYEE_SALARIES: "employee_salaries",
  LOGIN: "login",
};

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
    name: "",
    email: "",
    salary: "",
    startDate: "",
    position: "",
  },
  [FORM_NAMES.LOGIN]: {
    email: "",
    password: "",
  },
  [FORM_NAMES.EMPLOYEE_LEAVES]: {
    employee_id: "",
    startDate: "",
    endDate: "",
    reason: "",
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
      name: "",
      email: "",
      salary: "",
      startDate: "",
      position: "",
    },
    [FORM_NAMES.EMPLOYEE_LEAVES]: {
      employee_id: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
    [FORM_NAMES.LOGIN]: {
      email: "",
      password: "",
    },
  },
  authToken: null, // Store auth token here
  user: null, // Optionally store user info here (if returned by the API)
};

// Helper function to get form state by name
const getFormState = (state, formName) => state.form[formName] || {};

export const createEmployeeLeave = createAsyncThunk(
  "form/createEmployeeLeave",
  async (leaveData, { rejectWithValue }) => {
    try {
      const { employee_id, startDate, endDate, reason } = leaveData;
      const userType = sessionStorage.getItem("userType");
      const userId = sessionStorage.getItem([userType] + "Id");

      const response = await axios.post(
        "http://localhost:3000/api/employees/leaves/createEmployeeLeave", // Adjust the URL as necessary
        {
          employee_id,
          startDate,
          endDate,
          reason,
          userType,
          userId,
          company_id: userId,
        }
      );
      if (response.data.success) {
        return response.data; // Return the success response data
      } else {
        return rejectWithValue(
          "An error occurred while submitting the leave request."
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

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
      const userType = sessionStorage.getItem("userType");
      const userId = sessionStorage.getItem([userType] + "Id");
      const response = await axios.post(
        "http://localhost:3000/api/invoices/create",
        { ...invoiceData, company_id: userId }
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
      const userType = sessionStorage.getItem("userType");
      const userId = sessionStorage.getItem([userType] + "Id");
      const response = await axios.post(
        "http://localhost:3000/api/client/createClient",
        { ...formData, company_id: userId }
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
// Async thunk for creating an employee
export const createEmployee = createAsyncThunk(
  "form/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const userType = sessionStorage.getItem("userType");
      const userId = sessionStorage.getItem([userType] + "Id");

      const response = await axios.post(
        "http://localhost:3000/api/employees/createEmployee",
        { ...employeeData, company_id: userId }
      );

      if (response.data.success === true) {
        return response.data; // Return the success response data
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

// Handling employee async operation in slice
extraReducers: (builder) => {
  builder
    .addCase(createEmployee.pending, (state) => {
      state.isSubmitting = true;
      state.errors = {}; // Clear previous errors
    })
    .addCase(createEmployee.fulfilled, (state, action) => {
      state.isSubmitting = false;
      state.isSubmitted = true;
      // Optionally reset the employee form state after success
      state[FORM_NAMES.EMPLOYEE] = initialState[FORM_NAMES.EMPLOYEE];
    })
    .addCase(createEmployee.rejected, (state, action) => {
      state.isSubmitting = false;
      // Handling errors specific to the employee form
      state.errors[FORM_NAMES.EMPLOYEE] = action.payload.form;
    });
};

export const login = createAsyncThunk(
  "form/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/companyLogin",
        loginData
      );
      if (response.data.success) {
        sessionStorage.setItem("authToken", response.data.token);
        sessionStorage.setItem("userType", response.data.userType);
        const userType = response.data.userType;
        sessionStorage.setItem([userType] + "Id", response.data.user.id);

        return response.data;
      } else {
        return rejectWithValue({
          form: "An error occurred while logging in.",
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
        state.errors[FORM_NAMES.EMPLOYEE] = action.payload.message;
      })
      // Handling employee leave async operation
      .addCase(createEmployeeLeave.pending, (state) => {
        state.isSubmitting = true;
        state.errors = {};
      })
      .addCase(createEmployeeLeave.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSubmitted = true;
      })
      .addCase(createEmployeeLeave.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors[FORM_NAMES.EMPLOYEE_LEAVES] = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors[FORM_NAMES.LOGIN] = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authToken = action.payload.token;
        state.user = action.payload.user;
        state.isSubmitting = false;
        state.isSubmitted = true;
      })
      .addCase(login.pending, (state) => {
        state.isSubmitting = true;
        state.errors = {};
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
