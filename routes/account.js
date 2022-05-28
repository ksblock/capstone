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

// 회원가입시 id 중복 체크
router.post("/idCheck", function (req, res) {
  const param = [req.body.id];
  console.log(req.body.id);

  var sql = "SELECT count(*) FROM user_info WHERE user_info.id = ?";
  conn.query(sql, param, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result[0]["count(*)"]);
    if (result[0]["count(*)"] === 0) {
      //id 사용 가능
      console.log(result[0]);
      res.send({ status: 200, result: 0 });
    }
    //id 사용 불가
    else res.send({ status: 200, result: 1 });
  });
});

router.get("/signup", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/account", "signup.html"));
});

// 회원가입 정보 입력
router.post("/signup", function (req, res) {
  console.log(req.body);
  const param = [
    req.body.user_name,
    req.body.nickname,
    req.body.id,
    req.body.pw,
    req.body.phone,
    req.body.email,
    req.body.state,
    req.body.city,
  ];

  var sql = "INSERT INTO user_info VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?)";
  conn.query(sql, param, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
  res.send({ success: true });
});

// 회원가입시 스포츠 종목 추가(여러 종목 가능)
router.post("/signup/sports/:user_id", function (req, res) {
  var id = req.params.user_id;
  var sports = req.body.sports;
  const sports_length = Object.keys(sports).length;

  var sql = "insert into user_sports values(?, ?);";

  for (var cnt = 0; cnt < sports_length; cnt++) {
    var par = [id, sports[cnt]];

    conn.query(sql, par, (err, result) => {
      if (err) console.log(err);
    });

    // params.push(par);
  }

  res.send({ message: "성공" });
});

// router.get("/login", function (req, res) {
//   if (req.isAuthenticated()) res.redirect("/" + req.user.user_id);
//   if (req.user) {
//     console.log(req.user);
//     console.log(typeof req.user);
//     console.log(req.user.user_id);
//     //console.log(req.session);
//   }
//   res.sendFile(path.join(__dirname, "../public/account", "login.html"));
// });

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/account/successLogin",
    failureRedirect: "/account/failureLogin",
    session: true,
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.send({ message: "로그아웃 성공" });
});

router.get("/successLogin", function (req, res) {
  console.log(req.headers.cookie);
  console.log(req.user);
  res.send({ user: req.user, message: "로그인 성공" });
});

router.get("/failureLogin", function (req, res) {
  res.send({ message: "로그인 실패" });
});

router.get("/test", function (req, res) {
  console.log(req.session);
  console.log(req.user);
  res.redirect("/account/login");
});

module.exports = router;
