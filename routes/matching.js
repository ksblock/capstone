const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const { isBuffer } = require("util");
const conn = require("../config/db_config");
const mysql = require("mysql2");

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

// 매칭 취소
router.put("/:matching_id", function (req, res) {
  const param = [req.params.matching_id];

  var sql = "UPDATE matching_info SET status = 0 WHERE matching_id = ?";

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

// 매칭 포지션 취소
router.put("/position/:matching_id", function (req, res) {
  const param = [req.params.matching_id, req.body.user_id];

  var sql =
    "UPDATE matching_player SET status = 0 WHERE matching_id = ? AND user_id = ?";

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
  var sql =
    "SELECT matching_id, matching_info.user_id, gym_info.gym_id, matching_info.reservation_id, matching_info.description, matching_info.status, level, gym_info.sports, reservation.start_time, reservation.end_time FROM matching_info, gym_info, reservation WHERE matching_info.gym_id = gym_info.gym_id AND matching_info.reservation_id = reservation.reservation_id";

  conn.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.send(result);
  });
});

// 자동 매칭
router.get("/autoSearch", function (req, res) {
  const main = [req.body.sports, req.body.state, req.body.city];

  const extra = [req.body.position, req.body.level];
  level = req.body.level;
  // var sql1 =
  //   "SELECT matching_info.matching_id, sports, state, city, gym_name, level, position FROM matching_info, gym_info, matching_player WHERE gym_info.sports = ? AND gym_info.state = ? AND gym_info.city = ? AND matching_info.status = 1 AND matching_player.status = 1 AND gym_info.gym_id=matching_info.gym_id AND matching_info.matching_id = matching_player.matching_id;";
  // var sql1s = mysql.format(sql1, main);
  var sql2 =
    "SELECT matching_info.matching_id, sports, state, city, gym_name, level, description FROM matching_info, gym_info WHERE gym_info.sports = ? AND gym_info.state = ? AND gym_info.city = ? AND matching_info.status = 1 AND gym_info.gym_id=matching_info.gym_id;";
  var sql2s = mysql.format(sql2, main);

  conn.query(sql2s, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    if (result == 0) {
      // 종목, 지역에 해당하는 매칭이 없을 경우
      res.send("There is no matching. Create matching!");
    } else {
      var auto = new Array();
      console.log(result.length);
      const matching_number = result.length;
      for (var i = 0; i < matching_number; i++) {
        console.log(result[i].level);
        if (result[i].level == level) {
          auto.push(i);
        }
      }
      if (auto.length != 0) {
        // level과 같은 매칭이 존재할 경우, 목록 중 랜덤으로 선택
        res.send(result[auto[Math.floor(Math.random() * auto.length)]]);
      } else if (auto.length == 0) {
        // level 차이가 1인 매칭 검색
        for (var j = 0; j < matching_number; j++) {
          console.log(Math.abs(result[j].level - level));
          if (Math.abs(result[j].level - level) == 1) {
            auto.push(j);
          }
        }
        res.send(result[auto[Math.floor(Math.random() * auto.length)]]);
      } else {
        // level 차이가 2인 매칭 검색
        for (var j = 0; j < matching_number; j++) {
          console.log(Math.abs(result[j].level - level));
          if (Math.abs(result[j].level - level) == 2) {
            auto.push(j);
          }
        }
        res.send(result[auto[Math.floor(Math.random() * auto.length)]]);
      }
    }
  });
});
module.exports = router;
