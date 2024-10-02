import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Sending Message
const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { message } = req.body;

  let conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, receiverId],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    message,
    senderId,
    receiverId,
  });

  if (newMessage) conversation.messages.push(newMessage._id);

  await Promise.all([conversation.save, newMessage.save()]);

  //   Socket IO Functionality and Implementation

  return res
    .status(200)
    .json(new ApiResponse(200, { newMessage }, "Message sent successfully !"));
});

// Receiving Message
const getMessages = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;

  const conversation = await Conversation.find({
    participants: {
      $all: [senderId, receiverId],
    },
  });

  if (!conversation)
    res
      .status(200)
      .json(new ApiResponse(200, { messages: [] }, "No conversation found."));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { messages: conversation?.messages },
        "Messages fetched successfully !"
      )
    );
});

export { sendMessage, getMessages };
