import express from "express";
import * as authController from "../controllers/authController.js";
const router = express.Router();

router.post("/companyLogin", authController.login);
router.post("/companyRegisteration", authController.registerCompany);
router.post("/employeeLogin", authController.employeeLogin);

export default router;
