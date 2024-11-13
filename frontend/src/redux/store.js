// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import dataReducer from "./dataSlice";

const store = configureStore({
  reducer: {
    form: formReducer, // Register the form slice
    data: dataReducer,
  },
});

export default store;
