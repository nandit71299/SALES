import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
const router = express.Router();

router.get("/getall", dashboardController.getDashboard); // get all clients
// router.get("/:id", clientController.getClient); // Get client by id
// router.post("/createClient", clientController.createClient); // create client

export default router;
