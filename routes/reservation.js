const express = require("express");
const { redirect } = require("express/lib/response");
const { appendFile } = require("fs");
const path = require("path");
const conn = require("../config/db_config");

const router = express.Router();

router.post("/", function (req, res) {
  const param = [
    req.body.user_id,
    req.body.gym_id,
    req.body.reservation_date,
    req.body.start_time,
    req.body.end_time,
    req.body.price,
    req.body.description,
    req.body.status,
  ];
  var sql = "INSERT INTO reservation VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?);";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

module.exports = router;
