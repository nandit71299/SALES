import express from "express";
import * as employeeController from "../controllers/employeeController.js";
const router = express.Router();

// Define routes for invoices
router.get("/getall", employeeController.getAllEmployees); // get all clients
// router.get("/:id", clientController.getClient); // Get client by id
router.post("/createEmployee", employeeController.createEmployee); // create client
router.get("/leaves/getAllLeaves", employeeController.getAllLeaves); // create client
router.post(
  "/leaves/createEmployeeLeave",
  employeeController.createEmployeeLeave
); // create client

export default router;
