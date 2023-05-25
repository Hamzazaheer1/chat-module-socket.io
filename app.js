const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT;

require("./db/conn");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.options("*", cors());

app.use(require("./router/chatRoute"));

// socket io implementation
const socket = require("./utils/chatSocket");
const io = require("socket.io")(3000);
socket(io);

// server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
