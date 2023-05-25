const Chat = require("../model/chatSchema");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createChat = catchAsync(async (req, res, next) => {
  const chatcreate = await Chat.create(req.body);

  res.status(201).json({
    status: "Success",
    message: "Chat Created",
    data: chatcreate,
  });
});

exports.getChats = catchAsync(async (req, res, next) => {
  let chat = [];

  if (req.user.role === "Client") {
    chat = await Chat.find({
      $and: [
        { client: { $eq: req.user.id } },
        { accountmanager: { $eq: req.user.accountmanager } },
      ],
    });
  }
  if (req.user.role === "Account") {
    chat = await Chat.find({ accountmanager: { $eq: req.user.id } });
  }

  if (!chat) return next(new AppError("No chat found", 404));

  res.status(200).json({
    status: "success",
    data: chat,
  });
});

exports.addMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (req.user.role === "Account") {
      chat.clientisSeen = false;
    }

    if (req.user.role === "Client") {
      chat.managerisSeen = false;
    }

    const messagess = [
      {
        message: req.body.message,
        name: req.user.name,
      },
    ];

    const chat2 = await Chat.updateOne(
      { _id: req.params.id },
      { $push: { messages: messagess } }
    );
    await chat.save();
    const chat3 = await Chat.findById(req.params.id);

    // chat.messages = messagess;
    // await chat.save();
    res.json({ data: chat3 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
