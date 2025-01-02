import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

const userIndexController = asyncHandler((req, res) => {
  res.status(200).json(new apiResponse(200, "This is user index route"));
});

export { userIndexController };
