const express = require("express");
const { redirect } = require("express/lib/response");
const { appendFile } = require("fs");
const path = require("path");
const conn = require("../config/db_config");

const router = express.Router();

// 예약 생성
router.post("/", function (req, res) {
  const param = [
    req.body.user_id,
    req.body.gym_id,
    req.body.date,
    req.body.start_time,
    req.body.end_time,
    req.body.description,
    req.body.status,
    req.body.court,
    req.body.player,
    req.body.merchant_uid,
    req.body.imp_uid,
    req.body.amount,
  ];
  var sql =
    "INSERT INTO reservation VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 예약 취소 요청
router.put("/cancel/:reservation_id", function (req, res) {
  const param = [req.params.reservation_id];
  var sql = "UPDATE reservation SET status = 0 WHERE reservation_id = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

//예약 가능 시간 조회
// router.get("/time:gym_id", function (req, res){
//   const param = [req.params.gym_id];
//   var
// })

module.exports = router;
