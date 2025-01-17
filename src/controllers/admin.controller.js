import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
  const { name, email, prn, role, password } = req.body;
  if (
    !password?.trim() ||
    !name?.trim() ||
    !email?.trim() ||
    !role?.trim() ||
    !prn.trim()
  ) {
    throw new apiError(
      422,
      "All fields are required: name, password, email, prn and role."
    );
  }
  const allowedRoles = ["student", "alumni"];
  if (!allowedRoles.includes(role)) {
    throw new apiError(400, "Invalid role provided.");
  }
  const userExists = await User.findOne({ $or: [{ prn }, { email }] });
  if (userExists) {
    throw new apiError(409, `User with prn or Email already exists`);
  }
  const newUser = await User.create({ password, name, email, role, prn });
  if (!newUser) {
    throw new apiError(
      500,
      "Something went wrong while creating user, Please try again"
    );
  }
  return res
    .status(201)
    .json(new apiResponse(201, "User registered successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { email, prn } = req.body;
  if (!email?.trim()) {
    throw new apiError(422, "Email is required to delete a user.");
  }
  const user = await User.findOneAndDelete({ email });
  if (!user) {
    throw new apiError(404, "User not found.");
  }
  res.status(200).json(new apiResponse(200, "User deleted successfully."));
});

export { createUser, deleteUser };
