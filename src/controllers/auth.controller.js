import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import generateAccessAndRefereshTokens from "../utils/generateJwtTokens.js";
import jwt from "jsonwebtoken";
const isProduction = process.env.NODE_ENV === "production";
const options = {
  httpOnly: true,
  secure: isProduction,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours (or your preferred expiration time)
  sameSite: "none", // This is critical for cross-origin requests
  path: "/", // Ensure cookies are available on all paths
  domain: undefined,
};

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
  res.header("Access-Control-Allow-Credentials", "true");
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

const logoutUser = asyncHandler(async (req, res) => {
  // remove tokens from db
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
  if (!updatedUser) {
    throw new apiError(500, "Internal Server Error");
  }
  // send res if succ
  res.header("Access-Control-Allow-Credentials", "true");
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, "User Logged Out Successfully"));
});

const verifyToken = asyncHandler(async (req, res) => {
  // Get the user without sensitive information
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new apiError(404, "User not found");
  }

  // Return the user data
  return res.status(200).json(
    new apiResponse(200, "Token verified successfully", {
      user,
    })
  );
});

const refresh_AccessToken = asyncHandler(async (req, res) => {
  const refreshTokenFromUser =
    req.cookies?.refreshToken || req.body.refreshToken;
  if (!refreshTokenFromUser) {
    throw new apiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(
    refreshTokenFromUser,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken?.id);
  if (!user) {
    throw new apiError(401, "Invalid Refresh Token");
  }
  if (refreshTokenFromUser !== user.refreshToken) {
    throw new apiError(401, "Refresh Token is expired or used");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, "Access token refreshed successfully"));
});

export { loginUser, logoutUser, refresh_AccessToken, verifyToken };

// const registerUser = asyncHandler(async (req, res) => {
//   //get input data from req
//   console.log(req.body);
//   const { username, password, name, email, role } = req.body;
//   //check all req fields
// if (!username || !password || !name || !email || !role) {
//   throw new apiError(
//     422,
//     "All fields are required: username, password, name, email and role."
//   );
// }
//   //check for role
// const allowedRoles = ["student", "alumni", "admin"];
// if (!allowedRoles.includes(role)) {
//   throw new apiError(400, "Invalid role provided.");
// }
//   //check if username and email exists
// const userExists = await User.findOne({ $or: [{ username }, { email }] });
// if (userExists) {
//   throw new apiError(409, `User with Username or Email already exists`);
// }
//   //make object using User model
//   //save to db
// const newUser = await User.create({ username, password, name, email, role });
// //check if its successful
// if (!newUser) {
//   throw new apiError(
//     500,
//     "Something went wrong while registering, Please try again"
//   );
// }
//   //return success res back
//   return res
//     .status(201)
//     .json(new apiResponse(200, "User registered successfully"));
// });
