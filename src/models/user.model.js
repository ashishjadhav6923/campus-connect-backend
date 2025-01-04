import mongoose from "mongoose";

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
    profileImage: {
      type: String,
      default: "Link of default image",
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
