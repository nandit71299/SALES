import express from "express";
import * as clientController from "../controllers/clientController.js";
const router = express.Router();

// Define routes for invoices
router.get("/getall", clientController.getAllClients); // get all clients
router.get("/:id", clientController.getClient); // Get client by id
router.post("/createClient", clientController.createClient); // create client

export default router;
