import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import generateAccessAndRefereshTokens from "../utils/generateJwtTokens.js";

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new apiError(422, "Email and Password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction, // Use secure cookies only in production
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200, "User logged In Successfully", {
        user: loggedInUser,
      })
    );
});

export { userIndexController, registerUser, loginUser };
