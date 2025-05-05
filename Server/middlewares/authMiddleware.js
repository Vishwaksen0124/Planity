import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    console.log("Token received:", token); // Add this log to see if token is being sent

    if (token) {
      // Verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decodedToken); // Log the decoded token

      // Fetch user information from the database
      const user = await User.findById(decodedToken.userId).select("isAdmin email");
      console.log("User found:", user); // Log user data

      // If user not found, send an error response
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      // Attach user data to the request object
      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Not authorized. Please log in again.",
      });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: "Session expired. Please log in again.",
      });
    }
    return res.status(401).json({
      status: false,
      message: "Not authorized. Token verification failed.",
    });
  }
};


const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };