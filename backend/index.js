const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Message = require("./models/Message.model.js");
const ws = require("ws");
const fs = require("fs");
const User = require("./models/User.model.js");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const jwtsecret = process.env.JWT_SECRET;
const bcryptSalt = bcryptjs.genSaltSync(10);

const app = express();
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173"
  })
);

async function getUserData(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies ? req.cookies.token : null;
    if (token) {
      jwt.verify(token, jwtsecret, {}, (err, userData) => {
        if (err) reject(err);
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

app.get("/test", (req, res) => {
  res.json("ok ");
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserData(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] }
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

app.get("/profile", (req, res) => {
  const token = req.cookies ? req.cookies.token : null;
  if (token) {
    jwt.verify(token, jwtsecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passok = bcryptjs.compareSync(password, foundUser.password);
    if (passok) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtsecret,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id
          });
        }
      );
    }
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtsecret,
      {},
      (e, token) => {
        if (e) throw e;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id
          });
      }
    );
  } catch (e) {
    if (e) throw e;
    res.status(500).json("ok");
  }
});

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username
          }))
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(";").find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtsecret, {}, (err, userData) => {
          if (err) return;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    try {
      const msgData = JSON.parse(message.toString());
      const { recipient, text, file } = msgData;
      let filename = null;
      if (file) {
        const parts = file.name.split(".");
        const ext = parts[parts.length - 1];
        filename = Date.now() + "." + ext;
        const path = __dirname + "/uploads/" + filename;
        const bufferData = Buffer.from(file.data.split(",")[1], "base64");
        await fs.promises.writeFile(path, bufferData);
      }

      if (recipient && (text || file)) {
        const msgDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
          file: file ? filename : null,
        });
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) =>
            c.send(
              JSON.stringify({
                text,
                sender: connection.userId,
                recipient,
                file: file ? filename : null,
                _id: msgDoc._id,
              })
            )
          );
      } else {
        console.log("Incomplete message data received.");
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  notifyAboutOnlinePeople();
});

module.exports = app;
