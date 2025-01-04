import mongoose from "mongoose";

const groupMetadataSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      unique: true,
    },
    admins: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: {
        validator: (admins) => admins.length > 0,
        message: "At least one admin is required for a group",
      },
    },
    description: { type: String, default: "" },
    groupImage: { type: String, default: "Link of defalt image" },
  },
  { timestamps: true }
);

export const GroupMetadata = mongoose.model(
  "GroupMetadata",
  groupMetadataSchema
);
