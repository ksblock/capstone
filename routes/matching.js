const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const { isBuffer } = require("util");
const conn = require("../config/db_config");

const router = express.Router();

// 매칭 생성
router.post("/", function (req, res) {
  const param = [
    req.body.user_id,
    req.body.gym_id,
    req.body.reservation_id,
    req.body.description,
    req.body.status,
    req.body.level,
  ];

  var sql = "INSERT INTO matching_info VALUES(NULL, ?, ?, ?, ?, ?, ?)";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.send(result);
  });
});

// 매칭 플레이어 포지션 선택
router.post("/position/:matching_id", function (req, res) {
  const param = [
    req.params.matching_id,
    req.body.user_id,
    req.body.position,
    req.body.status,
  ];

  var sql = "INSERT INTO matching_player VALUES(?, ?, ?, ?)";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.send(result);
  });
});

// 매칭 플레이어 조회
router.get("/position/:matching_id", function (req, res) {
  var sql = "SELECT * FROM matching_player";

  conn.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.send(result);
  });
});

// 매칭 목록 조회
router.get("/list", function (req, res) {
  var sql = "SELECT * FROM matching_info";

  conn.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.send(result);
  });
});

module.exports = router;
