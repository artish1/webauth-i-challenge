const express = require("express");
const apiRouter = require("./routes/apiRouter");
const server = express();

const session = require("express-session");

const sessionConfig = {
  name: "sessionid",
  secret: "My Fake Secret",
  cookie: {
    maxAge: 1000 * 60 * 30, // 1/2 hour
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false
};

server.use(express.json());
server.use(session(sessionConfig));

server.use("/api", apiRouter);

module.exports = server;
