const Chat = require("../model/chatSchema");

module.exports = (io) => {
  io.on("connection", (socket) => {
    Chat.find().then((result) => {
      socket.emit("output-messages", result);
    });
    console.log("a user connected");

    socket.emit("message", "Hello world");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("chatmessage", (msg) => {
      const message = new Chat({ msg });
      message.save().then(() => {
        io.emit("message", msg);
      });
    });
  });
};
