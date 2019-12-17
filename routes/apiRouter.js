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
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          user.password = null;
          req.session.user = user;
          res.status(200).json({ message: "Logged in" });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
        console.log("error: ", err);
        res
          .status(500)
          .json({ message: "error finding user by username", err });
      });
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({ message: "Could not log you out" });
      } else {
        res.status(200).json({ message: "Logged out!" });
      }
    });
  } else {
    res.status(200).json({ message: "You were never logged in..." });
  }
});

router.get("/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      console.log("Error getting users");
    });
});

function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
}

module.exports = router;
