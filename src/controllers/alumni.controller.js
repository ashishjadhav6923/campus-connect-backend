import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

const updateAlumniProfile = asyncHandler(async (req, res) => {
  const {
    yearOfPassing,
    domain,
    industry,
    companyName,
    jobTitle,
    linkedInProfile,
    yearsOfExperience,
  } = req.body;
  if (
    !yearOfPassing ||
    !domain ||
    !industry ||
    !companyName ||
    !jobTitle ||
    !linkedInProfile ||
    !yearsOfExperience
  ) {
    throw new apiError(
      422,
      "All fields are required: year of Passing, domain, industry,company name,job title ,linkedIn profile and years of experience."
    );
  }
  if (isNaN(yearOfPassing)) {
    throw new apiError(422, "year of passing must be a valid number.");
  }
  const updatedAlumni = await User.findByIdAndUpdate(
    req.user._id,
    {
      isVerified: true,
      verifiedAt: new Date(),
      alumniInfo: {
        yearOfPassing,
        domain,
        industry,
        companyName,
        jobTitle,
        linkedInProfile,
        yearsOfExperience,
      },
    },
    { new: true, runValidators: true }
  );
  if (!updatedAlumni) {
    throw new apiError(500, "Failed to update the profile. Please try again.");
  }
  res.status(200).json(
    new apiResponse(200, "Alumni profile updated successfully.", {
      alumniInfo: updatedAlumni.alumniInfo,
    })
  );
});

export { updateAlumniProfile };
