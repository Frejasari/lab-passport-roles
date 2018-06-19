const express = require("express");
const router = express.Router();
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

function isBoss(req, res, next) {
  if (req.user.role === "boss") {
    next();
  } else {
    res.redirect("/");
  }
}

router.get("/signup", isBoss, (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: "boss"
      });

      newUser.save(err => {
        if (err) {
          res.render("signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

/* GET home page */
router.get("/login", (req, res, next) => {
  console.log("REQ.FLASH", req.flash("error"));
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/private", (req, res, next) => {
  console.log("You're fired!", req.user);
  res.render("private");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/all-users", (req, res, next) => {
  User.find({}).then(users => {
    res.render("all-users", { users });
  });
});

router.get("/delete/:id", (req, res, next) => {
  console.log("DELETE req.params.id", req.params.id);
  User.findByIdAndRemove(req.params.id).then(user => res.redirect("/all-users"));
});

module.exports = router;
