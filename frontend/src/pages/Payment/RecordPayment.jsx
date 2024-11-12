import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFieldValue,
  setSubmitting,
  setSubmitted,
  setError,
} from "../../redux/formSlice";
import { message } from "antd";

function RecordPayment() {
  const dispatch = useDispatch();

  // Get payment form state from the Redux store
  const payment = useSelector((state) => state.form.payment);
  const errors = useSelector((state) => state.form.errors?.payment); // Safely access errors
  const isSubmitting = useSelector((state) => state.form.isSubmitting);
  const isSubmitted = useSelector((state) => state.form.isSubmitted);

  // Simulating a list of invoices as demo data
  const invoices = [
    { id: "1", invoiceNumber: "INV123", client: "John Doe" },
    { id: "2", invoiceNumber: "INV124", client: "Jane Smith" },
    { id: "3", invoiceNumber: "INV125", client: "Emily Johnson" },
  ];

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
          field: "amount",
          message: "Amount is required.",
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

    // Simulate form submission (e.g., API call)
    setTimeout(() => {
      const success = true; // Simulate success or failure

      if (success) {
        message.success("Payment Recorded Successfully");
        setTimeout(() => {
          dispatch(setSubmitted());
          window.location.href = "/payments"; // Redirect to another page after success
        }, 2000);
      } else {
        dispatch(
          setError({
            formName: "payment",
            field: "form",
            message: "An error occurred during payment recording.",
          })
        );
      }
    }, 2000); // Simulate API delay
  };

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
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - {invoice.client}
                </option>
              ))}
            </select>
            {errors?.invoice && (
              <div className="text-danger">{errors.invoice}</div>
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
