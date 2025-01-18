import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const updateStudentProfile = asyncHandler(async (req, res) => {
  const {
    yearOfPassing,
    department,
    domain,
    industry,
    preferredCompany,
    degree,
  } = req.body;

  if (
    !yearOfPassing ||
    !department ||
    !domain ||
    !industry ||
    !preferredCompany ||
    !degree
  ) {
    throw new apiError(
      422,
      "All fields are required: year of Passing, department, domain, industry, degree and preferred company."
    );
  }
  if (isNaN(yearOfPassing)) {
    throw new apiError(422, "year of passing must be a valid number.");
  }
  const updatedStudent = await User.findByIdAndUpdate(
    req.user._id,
    {
      studentInfo: {
        yearOfPassing,
        department,
        domain,
        industry,
        preferredCompany,
        degree,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedStudent) {
    throw new apiError(500, "Failed to update the profile. Please try again.");
  }

  res.status(200).json(
    new apiResponse(200, "Student profile updated successfully.", {
      studentInfo: updatedStudent.studentInfo,
    })
  );
});

export { updateStudentProfile };
