const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const conn = require("../config/db_config");

const router = express.Router();

// 체육관 목록 전체 조회
router.get("/list", function (req, res) {
  var sql =
    "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info";
  conn.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 목록 지역별(state)로 조회
router.get("/list/:state", function (req, res) {
  const param = [req.params.state];

  var sql =
    "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE state = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 목록 지역별(city)로 조회
router.get("/list/:state/:city", function (req, res) {
  const param = [req.params.city];

  var sql =
    "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE city = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 개별 기본정보 조회
router.get("/detail/:gym_id", function (req, res) {
  const param = [req.params.gym_id];

  var sql =
    "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE gym_id = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 개별 운영정보 조회
router.get("/operation/:gym_id", function (req, res) {
  const param = [req.params.gym_id];

  var sql =
    "SELECT gym_id, start_time, end_time, price, court, player_per_court, description FROM gym_operation WHERE gym_id = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 주소 or 좌표?

module.exports = router;
