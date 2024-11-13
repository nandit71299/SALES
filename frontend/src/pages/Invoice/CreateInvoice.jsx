import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFieldValue,
  setSubmitting,
  setSubmitted,
  setError,
  addItem,
  removeItem,
  updateItem,
} from "../../redux/formSlice";
import { message, Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { createInvoice } from "../../redux/formSlice";
import { fetchAllClients } from "../../redux/dataSlice"; // Import the action to fetch clients
import moment from "moment";
import { DatePicker } from "antd";

function CreateInvoice() {
  const dispatch = useDispatch();

  // Fetching form field values and errors for "invoice"
  const formData = useSelector((state) => state.form.invoice);
  const fieldValue = formData;
  const isSubmitting = useSelector((state) => state.form.isSubmitting);
  const isSubmitted = useSelector((state) => state.form.isSubmitted);
  const errors = useSelector((state) => state.form.errors.invoice) || {}; // Safe access
  const items = formData.items;
  useEffect(() => {
    console.log(items);
  }, []);

  // Fetch all clients from Redux
  const { allClients, isLoading, error } = useSelector((state) => state.data);

  // Dispatch action to fetch clients when the component mounts
  useEffect(() => {
    dispatch(fetchAllClients());
  }, [dispatch]);
  useEffect(() => {
    console.log(items);
  }, [items]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFieldValue({ formName: "invoice", field: name, value }));
  };

  // Handle changes in item fields (Item, Quantity, Price)
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateItem({ id: items[index].key, field: name, value }));
  };

  // Add a new row to the items table
  const addItemHandler = () => {
    dispatch(addItem());
  };

  // Remove a row from the items table
  const handleRemoveItem = (key) => {
    dispatch(removeItem({ key }));
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

    // Validate items: ensure each item has valid fields
    if (
      items.length === 0 ||
      items.some((item) => !item.name || item.quantity <= 0 || item.price <= 0)
    ) {
      dispatch(
        setError({
          formName: "invoice",
          field: "items",
          message:
            "All items must have a valid name, quantity (greater than 0), and price (greater than 0).",
        })
      );
      isValid = false;
    }

    // Additional check to ensure total calculation is valid
    items.forEach((item, index) => {
      if (item.quantity <= 0) {
        dispatch(
          setError({
            formName: "invoice",
            field: `items[${index}].quantity`,
            message: "Quantity must be greater than 0.",
          })
        );
        isValid = false;
      }
      if (item.price <= 0) {
        dispatch(
          setError({
            formName: "invoice",
            field: `items[${index}].price`,
            message: "Price must be greater than 0.",
          })
        );
        isValid = false;
      }
      if (!item.name) {
        dispatch(
          setError({
            formName: "invoice",
            field: `items[${index}].item`,
            message: "Item name is required.",
          })
        );
        isValid = false;
      }
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      console.log("Validation failed, not submitting");
      return; // Prevent submission if validation fails
    }

    // Collect the invoice data from the state
    const invoiceData = {
      invoice_number: fieldValue.invoiceNumber,
      invoice_date: fieldValue.invoiceDate,
      client_id: Number(fieldValue.client),
      amount: items.reduce((total, item) => total + item.total, 0), // Sum of all item totals
      status: fieldValue.status,
      due_date: fieldValue.expiryDate,
      items: items, // Now using items from Redux state
    };

    // Start form submission process
    dispatch(setSubmitting());

    // Dispatch createInvoice thunk
    try {
      const resultAction = await dispatch(createInvoice(invoiceData));
      if (createInvoice.fulfilled.match(resultAction)) {
        // Invoice created successfully
        message.success("Invoice Created Successfully");
        setTimeout(() => {
          dispatch(setSubmitted());
          window.location.href = "/invoices"; // Redirect after submission
        }, 2000);
      } else {
        // Handle error from API response
        dispatch(
          setError({
            formName: "invoice",
            field: "form",
            message: resultAction.payload.form || "An error occurred.",
          })
        );
      }
    } catch (error) {
      dispatch(
        setError({
          formName: "invoice",
          field: "form",
          message: "An error occurred during invoice creation.",
        })
      );
    }
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
          name="name"
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
              className="form-control"
              id="poNumber"
              name="poNumber"
              value={fieldValue.poNumber}
              onChange={handleChange}
              required
            />
            {errors?.poNumber && (
              <div className="text-danger">{errors.poNumber}</div>
            )}

            <label htmlFor="client" className="form-label mt-3">
              Client:
            </label>
            <select
              className="form-control"
              id="client"
              name="client"
              value={fieldValue.client}
              onChange={handleChange}
              required
            >
              <option value="">Select Client</option>
              {allClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors?.client && (
              <div className="text-danger">{errors.client}</div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">
              Status:
            </label>
            <select
              className="form-control"
              id="status"
              name="status"
              value={fieldValue.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="1">Draft</option>
              <option value="2">Sent</option>
              <option value="3">Paid</option>
            </select>

            {/* Invoice Date */}
            <label htmlFor="invoiceDate" className="form-label mt-3">
              Invoice Date:
            </label>
            <input
              type="date"
              name="invoiceDate"
              required
              className="form-control"
              onChange={handleChange}
            />
            {errors?.invoiceDate && (
              <div className="text-danger">{errors.invoiceDate}</div>
            )}

            {/* Due Date */}
            <label htmlFor="dueDate" className="form-label mt-3">
              Due Date:
            </label>
            <input
              className="form-control"
              type="date"
              name="expiryDate"
              required
              onChange={handleChange}
            />
            {errors?.dueDate && (
              <div className="text-danger">{errors.dueDate}</div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={items}
            pagination={false}
            rowKey="key"
            footer={() => (
              <Button
                type="primary"
                onClick={addItemHandler}
                block
                disabled={isSubmitting}
              >
                Add Item
              </Button>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isSubmitted}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;
