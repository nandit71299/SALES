import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFieldValue,
  setSubmitting,
  setSubmitted,
  setError,
} from "../../redux/formSlice";
import {
  fetchAllInvoices,
  selectAllInvoices,
  selectIsLoading,
  selectError,
} from "../../redux/dataSlice"; // Import the thunk and selectors
import { message } from "antd";
import { recordPayment } from "../../redux/formSlice"; // Import the recordPayment thunk

function RecordPayment() {
  const dispatch = useDispatch();

  // Get payment form state from the Redux store
  const payment = useSelector((state) => state.form.payment);
  const errors = useSelector((state) => state.form.errors?.payment); // Safely access errors
  const isSubmitting = useSelector((state) => state.form.isSubmitting);
  const isSubmitted = useSelector((state) => state.form.isSubmitted);
  const invoiceState = payment.invoice;

  // Fetch invoices from Redux
  const invoices = useSelector(selectAllInvoices);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  console.log(error);
  // Fetch invoices when the component is mounted
  useEffect(() => {
    dispatch(fetchAllInvoices());
  }, [dispatch]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFieldValue({ formName: "payment", field: name, value }));
  };

  // Validation function to check if required fields are filled
  const validateForm = () => {
    let isValid = true;

    // Clear previous errors
    Object.keys(payment).forEach((field) => {
      dispatch(setError({ formName: "payment", field, message: "" }));
    });

    // Simple validation: check if required fields are filled
    if (!payment.invoice) {
      dispatch(
        setError({
          formName: "payment",
          field: "invoice",
          message: "Invoice is required.",
        })
      );
      isValid = false;
    }
    if (!payment.amount) {
      dispatch(
        setError({
          formName: "payment",
          field: "pending_amount",
          message: "Amount is required.",
        })
      );
      isValid = false;
    }
    if (payment.amount > selectedInvoice.amount) {
      dispatch(
        setError({
          formName: "payment",
          field: "pending_amount",
          message: "Amount cannot be greater than pending amount.",
        })
      );
      isValid = false;
    }
    if (!payment.paymentMode) {
      dispatch(
        setError({
          formName: "payment",
          field: "paymentMode",
          message: "Payment mode is required.",
        })
      );
      isValid = false;
    }
    if (!payment.referenceNo) {
      dispatch(
        setError({
          formName: "payment",
          field: "referenceNo",
          message: "Reference number is required.",
        })
      );
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return; // Prevent submission if validation fails
    }

    // Start form submission
    dispatch(setSubmitting());

    // Prepare payment data
    const paymentData = {
      invoice_id: payment.invoice,
      amount: payment.amount,
      payment_mode: payment.paymentMode,
      reference_number: payment.referenceNo,
    };

    // Dispatch recordPayment thunk
    dispatch(recordPayment(paymentData))
      .unwrap()
      .then(() => {
        // On success, show success message and set form to submitted
        message.success("Payment Recorded Successfully");

        setTimeout(() => {
          dispatch(setSubmitted());
          window.location.href = "/payments"; // Redirect to another page after success
        }, 2000);
      })
      .catch((err) => {
        // On failure, show error message
        console.log(err);
        message.error(
          err?.message || "An error occurred while recording payment."
        );
        dispatch(
          setError({
            formName: "payment",
            field: "form",
            message: "An error occurred during payment recording.",
          })
        );
      });
  };

  // If loading invoices or an error occurred, show respective messages
  if (isLoading) {
    return <div>Loading invoices...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Find the selected invoice
  const selectedInvoice = invoices.find(
    (invoice) => Number(invoice.id) === Number(payment.invoice)
  );
  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center">Record Payment</h2>
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6 mb-3">
            <label htmlFor="invoice" className="form-label">
              Invoice:
            </label>
            <select
              id="invoice"
              name="invoice"
              className="form-select"
              value={payment.invoice}
              onChange={handleChange}
              required
            >
              <option value="">Select Invoice</option>
              {invoices.map((invoice) => {
                return (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoice_number}
                  </option>
                );
              })}
            </select>

            {/* Display selected invoice details */}
            {selectedInvoice ? (
              <div className="text-muted mt-2">
                <p>Pending Amount: {selectedInvoice?.pending_amount || 0}</p>
              </div>
            ) : (
              <div className="text-muted mt-2">
                <p className="mt-5"></p>
              </div>
            )}

            {errors?.pending_amount && (
              <div className="text-danger">{errors?.pending_amount}</div>
            )}

            <label htmlFor="amount" className="form-label mt-3">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-control"
              value={payment.amount}
              onChange={handleChange}
              required
              disabled={selectedInvoice ? false : true}
            />
            {errors?.amount && (
              <div className="text-danger">{errors.amount}</div>
            )}

            <label htmlFor="paymentMode" className="form-label mt-3">
              Payment Mode:
            </label>
            <select
              id="paymentMode"
              name="paymentMode"
              className="form-select"
              value={payment.paymentMode}
              onChange={handleChange}
              required
              disabled={selectedInvoice ? false : true}
            >
              <option value="">Select Payment Mode</option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
              <option value="bankTransfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
            {errors?.paymentMode && (
              <div className="text-danger">{errors.paymentMode}</div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-md-6 mb-3">
            <label htmlFor="referenceNo" className="form-label">
              Reference Number:
            </label>
            <input
              type="text"
              id="referenceNo"
              name="referenceNo"
              className="form-control"
              value={payment.referenceNo}
              onChange={handleChange}
              required
              disabled={selectedInvoice ? false : true}
            />
            {errors?.referenceNo && (
              <div className="text-danger">{errors.referenceNo}</div>
            )}

            <label htmlFor="description" className="form-label mt-3">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={payment.description}
              onChange={handleChange}
              disabled={selectedInvoice ? false : true}
            />
            {errors?.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Recording..." : "Record Payment"}
          </button>
        </div>
      </form>

      {isSubmitted && !isSubmitting && (
        <div className="alert alert-success mt-4">
          Payment recorded successfully!
        </div>
      )}

      {errors?.form && !isSubmitting && (
        <div className="alert alert-danger mt-4">{errors.form}</div>
      )}
    </div>
  );
}

export default RecordPayment;
