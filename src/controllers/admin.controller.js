import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminIndexController = asyncHandler((req, res) => {
  res.status(200).json(new apiResponse(200,'This is admin index route'));
});

export { adminIndexController };
