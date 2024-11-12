import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFieldValue,
  setSubmitting,
  setSubmitted,
  setError,
} from "../../redux/formSlice";
import { message, Button } from "antd";

function CreateClient() {
  const dispatch = useDispatch();

  // Fetching form field values and errors for "client"
  const formData = useSelector((state) => state.form.client);
  const fieldValue = useSelector((state) => state.form.client);
  const isSubmitting = useSelector((state) => state.form.isSubmitting);
  const isSubmitted = useSelector((state) => state.form.isSubmitted);
  const errors = useSelector((state) => state.form.errors.client) || {}; // Safe access

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFieldValue({ formName: "client", field: name, value }));
  };

  // Validation function to check if required fields are filled
  const validateForm = () => {
    let isValid = true;

    // Clear previous errors for this form
    Object.keys(errors).forEach((field) => {
      dispatch(setError({ formName: "client", field, message: "" }));
    });

    // Simple validation: check if required fields are filled
    if (!fieldValue.name) {
      dispatch(
        setError({
          formName: "client",
          field: "name",
          message: "Client name is required.",
        })
      );
      isValid = false;
    }
    if (!fieldValue.contact) {
      dispatch(
        setError({
          formName: "client",
          field: "contact",
          message: "Contact person is required.",
        })
      );
      isValid = false;
    }
    if (!fieldValue.phone) {
      dispatch(
        setError({
          formName: "client",
          field: "phone",
          message: "Phone number is required.",
        })
      );
      isValid = false;
    }
    if (!fieldValue.email) {
      dispatch(
        setError({
          formName: "client",
          field: "email",
          message: "Email is required.",
        })
      );
      isValid = false;
    }
    if (!fieldValue.website) {
      dispatch(
        setError({
          formName: "client",
          field: "website",
          message: "Website URL is required.",
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

    // Log the entire form data
    console.log("Form Data from Redux State: ", formData);

    // Start form submission process
    dispatch(setSubmitting());

    // Simulate form submission
    setTimeout(() => {
      const success = true; // Simulate success

      if (success) {
        message.success("Client Created Successfully");
        setTimeout(() => {
          dispatch(setSubmitted());
          window.location.href = "/clients"; // Redirect after submission
        }, 2000);
      } else {
        dispatch(
          setError({
            formName: "client",
            field: "form",
            message: "An error occurred during form submission.",
          })
        );
      }
    }, 2000); // Simulate delay
  };

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center">New Client</h2>
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">
              Client Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={fieldValue.name}
              onChange={handleChange}
              required
            />
            {errors?.name && <div className="text-danger">{errors.name}</div>}

            <label htmlFor="contact" className="form-label mt-3">
              Contact Person:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              className="form-control"
              value={fieldValue.contact}
              onChange={handleChange}
              required
            />
            {errors?.contact && (
              <div className="text-danger">{errors.contact}</div>
            )}

            <label htmlFor="phone" className="form-label mt-3">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              value={fieldValue.phone}
              onChange={handleChange}
              required
            />
            {errors?.phone && <div className="text-danger">{errors.phone}</div>}
          </div>

          {/* Right Column */}
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={fieldValue.email}
              onChange={handleChange}
              required
            />
            {errors?.email && <div className="text-danger">{errors.email}</div>}

            <label htmlFor="website" className="form-label mt-3">
              Website:
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="form-control"
              value={fieldValue.website}
              onChange={handleChange}
              required
            />
            {errors?.website && (
              <div className="text-danger">{errors.website}</div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create Client"}
          </button>
        </div>
      </form>

      {isSubmitted && !isSubmitting && (
        <div className="alert alert-success mt-4">
          Client created successfully!
        </div>
      )}

      {errors?.form && !isSubmitting && (
        <div className="alert alert-danger mt-4">{errors.form}</div>
      )}
    </div>
  );
}

export default CreateClient;
