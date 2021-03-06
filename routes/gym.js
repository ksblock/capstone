const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const conn = require("../config/db_config");

const router = express.Router();

// 체육관 목록 전체 조회
router.get("/list", function (req, res) {
  var sql =
    "SELECT gym_info.gym_id, gym_info.gym_name, gym_info.host_id, gym_info.email, gym_info.phone, gym_info.location, gym_info.state, gym_info.city, gym_info.sports, gym_operation.price FROM gym_info, gym_operation WHERE gym_info.gym_id = gym_operation.gym_id";
  conn.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 목록 종목별로 조회
router.get("/list/:sports", function (req, res) {
  const param = [req.params.sports];

  var sql =
    "SELECT gym_info.gym_id, gym_info.gym_name, gym_info.host_id, gym_info.email, gym_info.phone, gym_info.location, gym_info.state, gym_info.city, gym_info.sports, gym_operation.price FROM gym_info, gym_operation WHERE sports = ? AND gym_info.gym_id = gym_operation.gym_id";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 목록 지역별(state)로 조회
// path value 방식
router.get("/list/state/:state", function (req, res) {
  const param = [req.params.state];

  var sql =
    "SELECT gym_info.gym_id, gym_info.gym_name, gym_info.host_id, gym_info.email, gym_info.phone, gym_info.location, gym_info.state, gym_info.city, gym_info.sports, gym_operation.price FROM gym_info, gym_operation WHERE state = ? AND gym_info.gym_id = gym_operation.gym_id";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.send(result);
  });
});

// 체육관 목록 지역별(state)로 조회
// query string 방식
// router.get("/list", function (req, res) {

//   const param = [req.query.state];

//   var sql =
//     "SELECT gym_info.gym_id, gym_info.gym_name, gym_info.host_id, gym_info.email, gym_info.phone, gym_info.location, gym_info.state, gym_info.city, gym_info.sports, gym_operation.price FROM gym_info, gym_operation WHERE state = ? AND gym_info.gym_id = gym_operation.gym_id";
//   conn.query(sql, param, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log("success");
//     res.send(result);
//   });
// });

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

// gym/list/filter?state=&sports
// 체육관 목록 필터링
// query string 방식
router.get("/list/filter", function (req, res) {
  let param;
  if (req.query.state) {
    if (req.query.city) {
      if (req.query.sports) {
        //state city sports
        param = [req.query.state, req.query.city, req.query.sports];
        var sql =
          "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE state = ? AND city = ? AND sports = ?";
      } else {
        //state city
        param = [req.query.state, req.query.city];
        var sql =
          "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE state = ? AND city = ?";
      }
    } else if (req.query.sports) {
      //state sports
      param = [req.query.state, req.query.sports];
      var sql =
        "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE state = ? AND sports = ?";
    } else {
      //state
      param = [req.query.state];
      var sql =
        "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE state = ?";
    }
  } else if (req.query.sports) {
    if (req.query.state) {
      if (req.query.city) {
        //sports state city
        param = [req.query.sports, req.query.state, req.query.city];
        var sql =
          "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE sports = ? AND state = ? AND city = ?";
      } else {
        //sports state
        param = [req.query.sports, req.query.state];
        var sql =
          "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE sports = ? AND state = ?";
      }
    } else {
      //sports
      param = [req.query.sports];
      var sql =
        "SELECT gym_id, gym_name, host_id, email, phone, location, state, city, sports FROM gym_info WHERE sports = ?";
    }
  }
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

// 체육관 전체 가격 조회
router.get("/operation", function (req, res) {
  //const param = [req.params.gym_id];

  var sql = "SELECT gym_id, price FROM gym_operation";
  conn.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 주소 조회
router.get("/address/:gym_id", function (req, res) {
  const param = [req.params.gym_id];

  var sql = "SELECT state, city, location FROM gym_info WHERE gym_id = ?";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 체육관 검색
router.get("/search/:gym_name", function (req, res) {
  const param = [req.params.gym_name];

  var sql =
    "SELECT gym_id, gym_name FROM gym_info WHERE gym_name LIKE CONCAT('%',?,'%')";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

module.exports = router;
