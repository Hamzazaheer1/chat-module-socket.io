const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;
