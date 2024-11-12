// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";

const store = configureStore({
  reducer: {
    form: formReducer, // Register the form slice
  },
});

export default store;
