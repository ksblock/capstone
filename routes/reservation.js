const express = require("express");
const { redirect } = require("express/lib/response");
const { appendFile } = require("fs");
const path = require("path");
const conn = require("../config/db_config");
const mysql = require("mysql2");
const { start } = require("repl");

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

//reservation/time/:gym_id?date=2022-05-03
//예약 가능 시간 조회
router.get("/time/:gym_id", function (req, res) {
  const gym_id = [req.params.gym_id, req.query.date];
  var sql1 =
    "SELECT start_time, end_time, court FROM reservation WHERE gym_id = ? AND date = ?;";
  var sql1s = mysql.format(sql1, gym_id);

  var sql2 = "SELECT court FROM gym_operation WHERE gym_id = ?;";
  var sql2s = mysql.format(sql2, gym_id);

  conn.query(sql1s + sql2s, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    var all_court = result[1][0].court; // court 개수 가져오기
    console.log(all_court);
    var time = new Array(24); // 시간당 예약 가능한 court 수가 들어갈 time 배열 생성(0시~23시)
    time.fill(all_court, 0, 24); // time 배열의 모든 값을 court값으로 초기화
    console.log(time);
    console.log(result[0]);

    var reserve_num = result[0].length;
    console.log(reserve_num);

    for (var i = 0; i < reserve_num; i++) {
      for (var j = result[0][i].start_time; j < result[0][i].end_time; j++) {
        time[j - 1] -= result[0][i].court;
      }
    }
    console.log(time);
    console.log("success");

    res.send(time);
  });
});

module.exports = router;
