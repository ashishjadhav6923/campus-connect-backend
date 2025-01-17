import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, secret } = req.body;

  if (secret !== process.env.ADMIN_CREATION_SECRET) {
    throw new apiError(403, "Unauthorized to create admins.");
  }

  if (!name || !email || !password) {
    throw new apiError(422, "All fields are required: name, email, password.");
  }

  const adminExists = await User.findOne({ email });
  if (adminExists) {
    throw new apiError(409, "Admin with this email already exists.");
  }

  const newAdmin = await User.create({
    name,
    email,
    password,
    role: "admin",
    prn: "00000000Z",
  });
  if (!newAdmin) {
    throw new apiError(500, "Something went wrong. Please try again.");
  }

  return res
    .status(201)
    .json(new apiResponse(201, "Admin created successfully", newAdmin));
});

export { createAdmin };
