const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const { mainModule } = require("process");
const conn = require("../config/db_config");

const router = express.Router();

// 유저 정보 조회
router.get("/info/:user_id", function (req, res) {
  const param = [req.params.user_id];
  var sql =
    "SELECT user_name, nickname, id, pw, phone, email, state, city FROM user_info WHERE user_id = ?";
  conn.query(sql, param, (err, result) => {
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
    "SELECT date, user_id, title, content, type, sports, state, city FROM board_post WHERE user_id = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 예약 이력 조회
// issue - 조회시 reservation_date 9시간 차이남
router.get("/reservation/:user_id", function (req, res) {
  const param = [req.params.user_id];
  var sql =
    "SELECT reservation_id, user_id, gym_id, reservation_date, start_time, end_time, price, description, status FROM reservation WHERE user_id = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.send(result);
  });
});

// ----------------추후 추가 예정------------------
// 매칭 이력 조회

module.exports = router;
