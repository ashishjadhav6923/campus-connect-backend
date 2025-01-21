import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
const getUserInfoByPrn = asyncHandler(async (req, res) => {
  const { prn } = req.params;
  if (!prn) {
    throw new apiError(422, "PRN is required.");
  }
  const user = await User.findOne({ prn }).select("-password -refreshToken");
  if (!user) {
    throw new apiError(404, `User with prn : ${prn} not found.`);
  }
  res
    .status(200)
    .json(
      new apiResponse(200, "User information retrieved successfully.", user)
    );
});

export { getUserInfoByPrn };
