import dataModel from "../models/dataModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { genNextSequenceValue } from "../utils/sequenceGenerator.js";
const Company = dataModel.Company;
const Employee = dataModel.Employee;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email }).select(
      "name id email password"
    );

    if (!company) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });
    }

    const comparePass = await bcrypt.compare(password, company.password);
    console.log(comparePass);
    if (comparePass == undefined || !comparePass) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Remove the password field from the company object before sending it back

    // Convert the Mongoose document to a plain JavaScript object
    const companyObj = company.toObject();
    delete companyObj.password;

    // Generate JWT token
    const token = jwt.sign(
      { company_id: companyObj.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Return the response with the company object and token
    return res.json({
      success: true,
      token: token,
      userType: "company",
      user: companyObj,
      message: "Succesfully Loggedin",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate that all fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const checkExisting = await Company.find({ email: email });

    if (checkExisting.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    // Hash the password before storing it
    const encryptedPass = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS) || 10
    );

    // Create a new company instance
    const company = new Company({
      id: await genNextSequenceValue("company"),
      name,
      email,
      password: encryptedPass,
    });

    // Save the company to the database
    await company.save();

    // Convert the company document to a plain object (to exclude sensitive data like password)
    const companyObj = company.toObject();

    // Exclude the password field from the response for security
    delete companyObj.password;

    // Respond with success message and company data (without password)
    return res.json({
      success: true,
      message: "Company registered successfully",
      company: companyObj,
    });
  } catch (error) {
    console.error("Error during company registration:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const employeeLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the employee
    const employee = await Employee.findOne({ email }).select(
      "name id email password"
    );
    if (employee.length > 0) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Compare the password
    const comparePass = await bcrypt.compare(password, employee.password);

    if (comparePass == undefined || !comparePass) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Remove the password field from the employee object before sending it back
    const employeeObj = employee.toObject();
    delete employeeObj.password;

    // Generate JWT token
    const token = jwt.sign(
      { employee_id: employeeObj.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // Return the response with the employee object and token
    return res.json({ token: token, employee: employeeObj });
  } catch (error) {
    console.error("Error during employee login:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
