import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state to store data for clients, invoices, payments, and dashboard
const initialState = {
  allClients: [],
  individualClient: null,
  allInvoices: [],
  individualInvoice: null,
  allPayments: [],
  individualPayment: null,
  dashboardData: null, // New state to store dashboard data
  isLoading: false,
  error: null,
};

// Thunk to fetch all clients data
export const fetchAllClients = createAsyncThunk(
  "data/fetchAllClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/client/getAll"
      );
      return response.data; // Assuming response.data is an array of clients
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk to fetch individual client data by ID
export const fetchClientData = createAsyncThunk(
  "data/fetchClientData",
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/client/${clientId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk to fetch all invoices data
export const fetchAllInvoices = createAsyncThunk(
  "data/fetchAllInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/invoices/getAll"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk to fetch individual invoice data by ID
export const fetchInvoiceData = createAsyncThunk(
  "data/fetchInvoiceData",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/invoices/${invoiceId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk to fetch all payments data
export const fetchAllPayments = createAsyncThunk(
  "data/fetchAllPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/payments/getall"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk to fetch individual payment data by ID
export const fetchPaymentData = createAsyncThunk(
  "data/fetchPaymentData",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/payments/${paymentId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// **Thunk to fetch Dashboard Data**
export const fetchDashboardData = createAsyncThunk(
  "data/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/dashboard/getall"
      );
      return response.data; // Assuming response.data is the dashboard data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setClientData: (state, action) => {
      state.individualClient = action.payload;
    },
    resetClientData: (state) => {
      state.individualClient = null;
    },
    setInvoiceData: (state, action) => {
      state.individualInvoice = action.payload;
    },
    resetInvoiceData: (state) => {
      state.individualInvoice = null;
    },
    setPaymentData: (state, action) => {
      state.individualPayment = action.payload;
    },
    resetPaymentData: (state) => {
      state.individualPayment = null;
    },
  },
  extraReducers: (builder) => {
    // Reducers for fetching all clients
    builder
      .addCase(fetchAllClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allClients = action.payload;
      })
      .addCase(fetchAllClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reducers for fetching individual client
    builder
      .addCase(fetchClientData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.individualClient = action.payload;
      })
      .addCase(fetchClientData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reducers for fetching all invoices
    builder
      .addCase(fetchAllInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allInvoices = action.payload;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reducers for fetching individual invoice
    builder
      .addCase(fetchInvoiceData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.individualInvoice = action.payload;
      })
      .addCase(fetchInvoiceData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reducers for fetching all payments
    builder
      .addCase(fetchAllPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allPayments = action.payload;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reducers for fetching individual payment
    builder
      .addCase(fetchPaymentData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.individualPayment = action.payload;
      })
      .addCase(fetchPaymentData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reducers for fetching dashboard data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Actions to reset or set data
export const {
  setClientData,
  resetClientData,
  setInvoiceData,
  resetInvoiceData,
  setPaymentData,
  resetPaymentData,
} = dataSlice.actions;

// Selectors to access state
export const selectAllClients = (state) => state.data.allClients;
export const selectIndividualClient = (state) => state.data.individualClient;
export const selectAllInvoices = (state) => state.data.allInvoices;
export const selectIndividualInvoice = (state) => state.data.individualInvoice;
export const selectAllPayments = (state) => state.data.allPayments;
export const selectIndividualPayment = (state) => state.data.individualPayment;
export const selectDashboardData = (state) => state.data.dashboardData; // Selector for dashboard data
export const selectIsLoading = (state) => state.data.isLoading;
export const selectError = (state) => state.data.error;

export default dataSlice.reducer;
