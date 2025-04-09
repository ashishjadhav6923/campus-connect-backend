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
      isVerified:true,
      verifiedAt: new Date(),
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

const searchAlumniByFilter = asyncHandler(async (req, res) => {
  const { domain, companyName, jobTitle } = req.body;
  if (!domain || !companyName || !jobTitle) {
    throw new apiError(
      422,
      "All fields are required: domain, company name, job title."
    );
  }
  const alumni = await User.find({
    role: "alumni",
    "alumniInfo.domain": domain,
    "alumniInfo.companyName": companyName,
    "alumniInfo.jobTitle": jobTitle,
  }).select("name prn profileImage alumniInfo");
  // const alumni = await User.aggregate([
  //   { $match: { role: "alumni" } },
  //   {
  //     $match: {
  //       "alumniInfo.domain": domain,
  //       "alumniInfo.companyName": companyName,
  //       "alumniInfo.jobTitle": jobTitle,
  //     },
  //   },
  //   {
  //     $project: {
  //       name: 1,
  //       prn: 1,
  //       profileImage: 1,
  //       alumniInfo: 1,
  //     },
  //   },
  // ]);
  if (!alumni.length) {
    throw new apiError(404, "No alumni found matching the given criteria.");
  }
  res
    .status(200)
    .json(
      new apiResponse(200, "Alumni profiles retrieved successfully.", alumni)
    );
});

export { updateStudentProfile, searchAlumniByFilter };
