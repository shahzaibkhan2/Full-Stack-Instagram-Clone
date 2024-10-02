import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export { Conversation };
