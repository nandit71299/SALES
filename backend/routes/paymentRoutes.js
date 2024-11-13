import express from "express";
import * as paymentController from "../controllers/paymentController.js";
const router = express.Router();

// Define routes for invoices
router.get("/getall", paymentController.getAll); // get all clients
// router.get("/:id", paymentController.getClient); // Get client by id
router.post("/recordPayment", paymentController.recordPayment); // create client

export default router;
