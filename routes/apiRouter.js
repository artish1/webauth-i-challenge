const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Users = require("../models/users-model");

router.post("/register", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res
      .status(400)
      .json({ error: "username and password fields are required" });
  } else {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    //Save user to db.
    Users.add(user)
      .then(newUser => {
        res.status(201).json(newUser);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Could not save user to db" });
      });
  }
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "username and password fields are required to login" });
  } else {
    Users.findBy({ username })
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: "Logged in" });
        } else {
          res.status(401).json({ error: "Invalid Credentials" });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "error finding user by username", err });
      });
  }
});

router.get("/users", (req, res) => {});

module.exports = router;
