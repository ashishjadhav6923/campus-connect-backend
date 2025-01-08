import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";

const userIndexController = asyncHandler((req, res) => {
  res.status(200).json(new apiResponse(200, "This is user index route"));
});

const registerUser = asyncHandler(async (req, res) => {
  //get input data from req
  console.log(req.body);
  const { username, password, name, email, role } = req.body;
  //check all req fields
  if (!username || !password || !name || !email || !role) {
    throw new apiError(
      422,
      "All fields are required: username, password, name, email and role."
    );
  }
  //check for role
  const allowedRoles = ["student", "alumni", "admin"];
  if (!allowedRoles.includes(role)) {
    throw new apiError(400, "Invalid role provided.");
  }
  //check if username and email exists
  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    throw new apiError(409, `User with Username or Email already exists`);
  }
  //make object using User model
  //save to db
  const newUser = await User.create({ username, password, name, email, role });
  //check if its successful
  if (!newUser) {
    throw new apiError(
      500,
      "Something went wrong while registering, Please try again"
    );
  }
  //return success res back
  return res
    .status(201)
    .json(new apiResponse(200, "User registered successfully"));
});

export { userIndexController, registerUser };
