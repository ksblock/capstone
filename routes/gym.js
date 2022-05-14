const express = require("express");
const res = require("express/lib/response");
const { redirect } = require("express/lib/response");
const { appendFile } = require("fs");
const path = require("path");
const conn = require("../config/db_config");

const router = express.Router();

// 체육관 목록 조회
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

// 체육관 지역별(state)로 조회
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

// 체육관 지역별(city)로 조회
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

module.exports = router;
