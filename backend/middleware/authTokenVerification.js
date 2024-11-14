import jwt from "jsonwebtoken";

// Middleware to check for a valid JWT token
const verifyToken = (req, res, next) => {
  // Get the token from Authorization header (usually in the format "Bearer <token>")
  const token = req.headers["authorization"]?.split(" ")[1]; // Split "Bearer <token>"

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Token is required" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );

    // Attach the decoded payload (company data or user info) to the request object
    req.user = decoded; // Add the decoded user data to the request object

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default verifyToken;
