import mongoose, { modelNames } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const preferencesSchema = new mongoose.Schema({
  domain: { type: [String], default: [] },
  tech: { type: [String], default: [] },
  interests: { type: [String], default: [] },
});

const studentSchema = new mongoose.Schema({
  collegeName: { type: String, default: null },
  passingYear: { type: Number, default: null },
  degree: { type: String, default: null },
  resume: { type: String, default: null }, // Optional: URL to resume
});

const alumniSchema = new mongoose.Schema({
  companyName: { type: String, default: null },
  collegeName: { type: String, default: null },
  passingYear: { type: Number, default: null },
  currentPosition: { type: String, default: null },
  linkedInProfile: { type: String, default: null }, // Optional: URL to LinkedIn
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, minLength: 3, maxLength: 50 },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: ["student", "alumni", "admin"],
    },
    preferences: preferencesSchema,
    profileImage: {
      type: String,
      default: "Link of default image",
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    refreshToken: { type: String },
    studentInfo: studentSchema,
    alumniInfo: alumniSchema,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    console.log("Error occured while encrypting password");
    next(error);
  }
});

userSchema.method("isPasswordCorrect", async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
});

userSchema.methods.generateAccessToken = function () {
  const user = this;
  return jwt.sign(
    {
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY || "1d"}` }
  );
};

userSchema.methods.generateRefreshToken = function () {
  const user = this;
  return jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY || "30d"}` }
  );
};

export const User = mongoose.model("User", userSchema);
