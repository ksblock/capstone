const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const { mainModule } = require("process");
const conn = require("../config/db_config");

const router = express.Router();

// 유저 정보 조회
router.get("/info", function (req, res) {
  var sql =
    "SELECT user_id, user_name, nickname, id, pw, phone, email, state, city FROM user_info";
  conn.query(sql, [], (err, result) => {
    if (err) {
      console.loog(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 유저 작성 글 이력 조회
router.get("/posting/:user_id", function (req, res) {
  const param = [req.params.user_id];
  var sql =
    "SELECT date, user_id, title, content, type, sports,  FROM board_post WHERE user_id = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.loog(err);
    }
    console.log("success");

    res.send(result);
  });
});

module.exports = router;
