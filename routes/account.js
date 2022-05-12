const express = require("express");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const conn = require("../config/db_config");
const req = require("express/lib/request");

const router = express.Router();

router.get("/", function (req, res) {
  console.log("test");

  //console.log(req.user);
  if (req.user) console.log("test");
  res.send("Hello, Express");
  //res.sendFile(path.join(__dirname, "../public", "gym.html"));
});

router.post("/idCheck", function (req, res) {
  const param = [req.body.id];
  console.log(req.body.id);

  var sql = "SELECT count(*) FROM users WHERE users.id = ?";
  conn.query(sql, param, function (err, result) {
    if (err) {
      console.log(err);
      res.redirect("/account/signup");
    }
    console.log(result[0]["count(*)"]);
    if (result[0]["count(*)"] === 0)
      //id 사용 가능
      res.send({ status: 200, result: 0 });
    //id 사용 불가
    else res.send({ status: 200, result: 1 });
  });
});

router.get("/signup", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/account", "signup.html"));
});

router.post("/signup", function (req, res) {
  console.log(req.body);
  const param = [
    req.body.name,
    req.body.nickname,
    req.body.id,
    req.body.pw,
    req.body.large,
    req.body.small,
    req.body.event,
  ];

  var sql = "INSERT INTO users VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)";
  conn.query(sql, param, function (err, result) {
    if (err) {
      console.log(err);
      return res.redirect("/account/signup");
    }
  });

  res.redirect("/account/login");
});

router.get("/login", function (req, res) {
  if (req.isAuthenticated()) res.redirect("/" + req.user.user_id);
  if (req.user) {
    console.log(req.user);
    console.log(typeof req.user);
    console.log(req.user.user_id);
    //console.log(req.session);
  }
  res.sendFile(path.join(__dirname, "../public/account", "login.html"));
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/account/login",
    session: true,
  }),
  function (req, res) {
    res.redirect("/" + req.user.user_id);
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/account/login");
});

router.get("/test", function (req, res) {
  console.log(req.session);
  console.log(req.user);
  res.redirect("/account/login");
});

module.exports = router;
