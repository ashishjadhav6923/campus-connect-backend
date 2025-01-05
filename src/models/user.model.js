import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

export const User = mongoose.model("User", userSchema);
