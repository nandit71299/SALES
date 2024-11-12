import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFieldValue,
  setSubmitting,
  setSubmitted,
  setError,
} from "../../redux/formSlice";
import { message, Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function CreateInvoice() {
  const dispatch = useDispatch();

  // Fetching form field values and errors for "invoice"
  const formData = useSelector((state) => state.form.invoice);
  const fieldValue = useSelector((state) => state.form.invoice);
  const isSubmitting = useSelector((state) => state.form.isSubmitting);
  const isSubmitted = useSelector((state) => state.form.isSubmitted);
  const errors = useSelector((state) => state.form.errors.invoice) || {}; // Safe access

  // State to manage invoice items dynamically
  const [items, setItems] = useState([
    { key: 1, item: "", quantity: 0, price: 0, total: 0 },
  ]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFieldValue({ formName: "invoice", field: name, value }));
  };

  // Handle changes in item fields (Item, Quantity, Price)
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;

    // Calculate total for this item
    if (name === "quantity" || name === "price") {
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].price;
    }

    setItems(updatedItems);
  };

  // Add a new row to the items table
  const addItem = () => {
    const newItem = {
      key: items.length + 1,
      item: "",
      quantity: 0,
      price: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove a row from the items table
  const handleRemoveItem = (key) => {
    const updatedItems = items.filter((item) => item.key !== key);
    setItems(updatedItems);
  };

  // Validation function to check if required fields are filled
  const validateForm = () => {
    let isValid = true;

    // Clear previous errors for this form
    Object.keys(errors).forEach((field) => {
      dispatch(setError({ formName: "invoice", field, message: "" }));
    });

    // Simple validation: check if required fields are filled
    if (!fieldValue.invoiceNumber) {
      dispatch(
        setError({
          formName: "invoice",
          field: "invoiceNumber",
          message: "Invoice number is required.",
        })
      );
      isValid = false;
    }
    if (!fieldValue.poNumber) {
      dispatch(
        setError({
          formName: "invoice",
          field: "poNumber",
          message: "PO number is required.",
        })
      );
      isValid = false;
    }
    if (!fieldValue.client) {
      dispatch(
        setError({
          formName: "invoice",
          field: "client",
          message: "Client is required.",
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

    // Log the entire form data (including items)
    console.log("Form Data from Redux State: ", { ...formData, items });

    // Start form submission process
    dispatch(setSubmitting());

    // Simulate form submission
    setTimeout(() => {
      const success = true; // Simulate success

      if (success) {
        message.success("Form Submitted Successfully");
        setTimeout(() => {
          dispatch(setSubmitted());
          window.location.href = "/invoices"; // Redirect after submission
        }, 2000);
      } else {
        dispatch(
          setError({
            formName: "invoice",
            field: "form",
            message: "An error occurred during form submission.",
          })
        );
      }
    }, 2000); // Simulate delay
  };

  // Define columns for Ant Design table
  const columns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text, record, index) => (
        <input
          type="text"
          name="item"
          value={text}
          onChange={(e) => handleItemChange(e, index)}
          className="form-control"
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record, index) => (
        <input
          type="number"
          name="quantity"
          value={text}
          onChange={(e) => handleItemChange(e, index)}
          className="form-control"
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => (
        <input
          type="number"
          name="price"
          value={text}
          onChange={(e) => handleItemChange(e, index)}
          className="form-control"
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => `₹${text.toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="danger"
          onClick={() => handleRemoveItem(record.key)}
          icon={<DeleteOutlined style={{ color: "red" }} />}
        ></Button>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center">New Invoice</h2>
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6 mb-3">
            <label htmlFor="invoiceNumber" className="form-label">
              Invoice Number:
            </label>
            <input
              type="text"
              className="form-control"
              id="invoiceNumber"
              name="invoiceNumber"
              value={fieldValue.invoiceNumber}
              onChange={handleChange}
              required
            />
            {errors?.invoiceNumber && (
              <div className="text-danger">{errors.invoiceNumber}</div>
            )}

            <label htmlFor="poNumber" className="form-label mt-3">
              PO Number:
            </label>
            <input
              type="text"
              id="poNumber"
              name="poNumber"
              className="form-control"
              value={fieldValue.poNumber}
              onChange={handleChange}
              required
            />
            {errors?.poNumber && (
              <div className="text-danger">{errors.poNumber}</div>
            )}

            <label htmlFor="invoiceDate" className="form-label mt-3">
              Invoice Date:
            </label>
            <input
              type="date"
              id="invoiceDate"
              name="invoiceDate"
              className="form-control"
              value={fieldValue.invoiceDate}
              onChange={handleChange}
              required
            />
            {errors?.invoiceDate && (
              <div className="text-danger">{errors.invoiceDate}</div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-md-6 mb-3">
            <label htmlFor="client" className="form-label">
              Client:
            </label>
            <select
              id="client"
              name="client"
              className="form-select"
              value={fieldValue.client}
              onChange={handleChange}
              required
            >
              <option value="">Select customer</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
              <option value="3">Emily Johnson</option>
            </select>
            {errors?.client && (
              <div className="text-danger">{errors.client}</div>
            )}

            <label htmlFor="status" className="form-label mt-3">
              Status:
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={fieldValue.status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="1">Sent</option>
              <option value="2">Paid</option>
              <option value="3">Cancelled</option>
            </select>
            {errors?.status && (
              <div className="text-danger">{errors.status}</div>
            )}

            <label htmlFor="expiryDate" className="form-label mt-3">
              Expiry Date:
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              className="form-control"
              value={fieldValue.expiryDate}
              onChange={handleChange}
            />
            {errors?.expiryDate && (
              <div className="text-danger">{errors.expiryDate}</div>
            )}

            <label htmlFor="note" className="form-label mt-3">
              Note:
            </label>
            <input
              type="text"
              id="note"
              name="note"
              className="form-control"
              value={fieldValue.note}
              onChange={handleChange}
            />
            {errors?.note && <div className="text-danger">{errors.note}</div>}
          </div>
        </div>

        <div>
          <hr />
          <h6 className="text-center">Items</h6>
          <Table
            dataSource={items}
            columns={columns}
            pagination={false}
            rowKey="key"
            bordered
            scroll={{ x: "max-content" }}
          />
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={addItem}>
              Add Item
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create Invoice"}
          </button>
        </div>
      </form>

      {isSubmitted && !isSubmitting && (
        <div className="alert alert-success mt-4">
          Form submitted successfully!
        </div>
      )}

      {errors?.form && !isSubmitting && (
        <div className="alert alert-danger mt-4">{errors.form}</div>
      )}
    </div>
  );
}

export default CreateInvoice;
