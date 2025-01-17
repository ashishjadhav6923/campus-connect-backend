import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res.status(440).json({
        statusCode: 440,
        success: false,
        message: "Access token is expired",
      });
    }
    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error occured while verifying access token");
    throw new apiError(
      401,
      error?.message || "Error occured while verifying access token"
    );
  }
});

const verifyRole = (requiredRole) => {
  return asyncHandler((req, res, next) => {
    const userRole = req.user?.role;
    if (userRole !== requiredRole) {
      throw new apiError(403, `Access denied. ${requiredRole} only.`);
    }
    next();
  });
};

export { verifyJwt, verifyRole };
