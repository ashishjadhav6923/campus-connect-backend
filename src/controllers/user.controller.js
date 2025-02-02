import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
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

const getAllUserChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const chatSessions = await ChatSession.find({
    $or: [{ student: userId }, { alumni: userId }], // Fetch chats where user is either student or alumni
  })
    .populate("student", "name profileImage") // Populate student details
    .populate("alumni", "name profileImage") // Populate alumni details
    .populate("lastMessage", "messageText timestamp") // Populate last message details
    .sort({ updatedAt: -1 }); // Sort by latest chat session update

  res
    .status(200)
    .json(
      new apiResponse(200, "Chat sessions retrieved successfully", chatSessions)
    );
});

const getChatMessages = asyncHandler(async (req, res) => {
  const { chatSessionId } = req.params;

  const messages = await Message.find({ chatSession: chatSessionId })
    .populate("sender", "name img") // Populate sender details
    .populate("recipient", "name img") // Populate recipient details
    .sort({ createdAt: 1 }); // Sort in ascending order (oldest first)

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        `All messages from chatSession:${chatSessionId} retrived successfully`,
        messages
      )
    );
});

const createChatSession = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  let student, alumni;
  if (req.user.role == "student") {
    student = req.user.id;
    alumni = userId;
  } else if (req.user.role == "alumni") {
    student = userId;
    alumni = req.user.id;
  } else {
    throw new apiError(403, "You are not allowed to start chat Session");
  }

  if (!student || !alumni) {
    throw new apiError(404, "Both user IDs are required");
  }

  // Check if a chat session already exists
  let chatSession = await ChatSession.findOne({
    student: student,
    alumni: alumni,
  });

  if (!chatSession) {
    // Create a new chat session
    chatSession = await ChatSession.create({
      student: student,
      alumni: alumni,
    });
  }

  res.status(200).json(
    new apiResponse(200, "Chat session successfully created", {
      chatSessionId: chatSession._id,
    })
  );
});

export {
  getUserInfoByPrn,
  getAllUserChats,
  getChatMessages,
  createChatSession,
};
