import dataModel from "../models/dataModel.js";
import { genNextSequenceValue } from "../utils/sequenceGenerator.js";
import bcrypt from "bcrypt";
const Employee = dataModel.Employee;
const EmployeeLeaves = dataModel.EmployeeLeaves;

export const getAllEmployees = async (req, res) => {
  const company_id = req.query.company_id;
  if (!company_id) {
    return res.status(400).json({ message: "Missing required Data" });
  }
  try {
    const employees = await Employee.find({ company_id: req.query.company_id });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, position, salary, company_id } = req.body;

    if (!name || !email || !password || !position || !company_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const checkExistingEmployee = await Employee.find({ email: email });
    if (checkExistingEmployee.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const encryptedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const newEmployee = await Employee.create({
      id: await genNextSequenceValue("employee"),
      name,
      email,
      password: encryptedPassword,
      position,
      company_id,
      salary,
    });
    const createdEmployee = newEmployee.toObject();
    delete createdEmployee.password;

    res.json({
      success: true,
      message: "Employee created",
      employee: createdEmployee,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const { company_id } = req.query; // Extract company_id from query parameters
    // Check if company_id is provided, if not return an error
    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    // Aggregate query to join EmployeeLeaves with Employee by employee_id and filter by company_id
    const allLeaves = await dataModel.EmployeeLeaves.aggregate([
      // Match to filter by company_id
      {
        $match: {
          company_id: Number(company_id), // Only include leaves that match the provided company_id
        },
      },
      {
        $lookup: {
          from: "employees", // The name of the Employee collection in lowercase
          localField: "employee_id", // Field in EmployeeLeaves collection to join on
          foreignField: "id", // Field in Employee collection to match with
          as: "employee_details", // Alias for the resulting employee data
        },
      },
      {
        $unwind: {
          path: "$employee_details", // Unwind the employee details array to access fields
          preserveNullAndEmptyArrays: true, // Allows leaves without employee details to still be included
        },
      },
      {
        $project: {
          employee_id: 1, // Include employee_id from EmployeeLeaves collection
          company_id: 1, // Include company_id from EmployeeLeaves collection
          startDate: 1, // Include start_date from EmployeeLeaves collection
          endDate: 1, // Include end_date from EmployeeLeaves collection
          reason: 1, // Include reason from EmployeeLeaves collection
          "employee_details.name": 1, // Include name from employee_details
          "employee_details.email": 1, // Include email from employee_details
          "employee_details.position": 1, // Include position from employee_details
          _id: 0, // Exclude the default _id field
        },
      },
    ]);

    // Check if we retrieved any leaves
    if (allLeaves.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No leaves found" });
    }

    // Return the employee leaves data along with employee details
    return res.json({ success: true, allLeaves });
  } catch (error) {
    console.error("Error fetching employee leaves:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createEmployeeLeave = async (req, res) => {
  try {
    const { employee_id, startDate, endDate, reason, company_id } = req.body;

    console.log(employee_id, startDate, endDate, reason);

    if (!employee_id || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newLeave = await EmployeeLeaves.create({
      id: await genNextSequenceValue("employeeLeave"),
      employee_id,
      startDate,
      endDate,
      company_id,
      reason,
    });

    res.json({
      success: true,
      message: "Leave created",
      leave: newLeave,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};
