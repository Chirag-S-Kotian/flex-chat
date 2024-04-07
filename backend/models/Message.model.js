const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

const MsgModel = mongoose.model("Message", MessageSchema);
module.exports = MsgModel;
