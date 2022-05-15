const express = require("express");
const { redirect } = require("express/lib/response");
const { appendFile } = require("fs");
const path = require("path");
const conn = require("../config/db_config");

const router = express.Router();

// 게시글 목록
router.get("/list", function (req, res) {
  var sql =
    "SELECT board_post.post_id, board_post.date, user_info.nickname, board_post.title, board_post.content, board_post.type, board_post.sports, board_post.state, board_post.city FROM user_info, board_post WHERE board_post.user_id = user_info.user_id;";
  conn.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 게시글 종목별 목록 조회
router.get("/list/sports/:sports", function (req, res) {
  const param = [req.params.sports];

  var sql =
    "SELECT board_post.post_id, board_post.date, user_info.nickname, board_post.title, board_post.content, board_post.type, board_post.sports, board_post.state, board_post.city FROM user_info, board_post WHERE board_post.sports = ? AND board_post.user_id = user_info.user_id;";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 게시글 지역별(state) 목록 조회
router.get("/list/region/:state", function (req, res) {
  // var querydata = url.parse(req.url, true).query;
  // const param = [querydata.state, querydata.city, querydata.sports];

  const param = [req.params.state];

  var sql =
    "SELECT board_post.post_id, board_post.date, user_info.nickname, board_post.title, board_post.content, board_post.type, board_post.sports, board_post.state, board_post.city FROM user_info, board_post WHERE board_post.state = ? AND board_post.user_id = user_info.user_id;";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 게시글 지역별(city) 목록 조회
router.get("/list/region/:state/:city", function (req, res) {
  const param = [req.params.city];

  var sql =
    "SELECT board_post.post_id, board_post.date, user_info.nickname, board_post.title, board_post.content, board_post.type, board_post.sports, board_post.state, board_post.city FROM user_info, board_post WHERE board_post.city = ? AND board_post.user_id = user_info.user_id;";
  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("success");

    res.send(result);
  });
});

// 개별 게시글 조회
router.get("/detail/:post_id", function (req, res) {
  const param = [req.params.post_id];
  // user_id 정보 추가
  var sql =
    "SELECT board_post.post_id, board_post.date, user_info.user_id, user_info.nickname, board_post.title, board_post.content, board_post.type, board_post.sports, board_post.state, board_post.city FROM user_info, board_post WHERE board_post.post_id = ? AND board_post.user_id = user_info.user_id;";

  conn.query(sql, param, (err, result) => {
    console.log(result);

    res.send(result);
  });
});

// 게시글에 달린 댓글 조회
router.get("/detail/:post_id/comment", (req, res) => {
  const param = [req.params.post_id];

  var sql_reply =
    "select board_comment.content, board_comment.date, user_info.nickname from user_info, board_comment where board_comment.post_id=? and user_info.user_id=board_comment.user_id;";

  conn.query(sql_reply, param, (err, result) => {
    console.log(result);

    res.send(result);
  });
});

router.get("/write", (req, res) => {
  res.send("write board");
});

// 게시글 작성
router.post("/write", (req, res) => {
  const params = [
    req.body.user_id,
    req.body.title,
    req.body.content,
    req.body.type,
    req.body.sports,
    req.body.state,
    req.body.city,
  ];

  var sql = "INSERT INTO board_post VALUES(NULL, now(), ?, ?, ?, ?, ?, ?, ?);";
  conn.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true });
  });
});

// 해당하는 게시글의 댓글 작성
router.post("/detail/:post_id/writeComment", (req, res) => {
  const param = [req.body.content, req.params.post_id, req.body.user_id];
  //DB column 순서 주의
  var sql = "INSERT INTO board_comment VALUES(NULL, now(), ?, ?, ?);";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true });
  });
});

// 게시글 수정
router.put("/detail/:post_id", function (req, res) {
  const param = [
    req.body.title,
    req.body.content,
    req.body.type,
    req.body.sports,
    req.body.state,
    req.body.city,
    req.params.post_id,
  ];

  var sql =
    "UPDATE board_post SET board_post.date = now(), board_post.title = ?, board_post.content = ?, board_post.type = ?, board_post.sports = ?, board_post.state = ?, board_post.city = ? WHERE board_post.post_id=?;";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);

    res.send({ success: true, result: result });
  });
});

// 댓글 수정
router.put("/detail/:post_id/:comment_id", (req, res) => {
  const param = [req.body.content, req.params.comment_id];

  var sql =
    "UPDATE board_comment SET board_comment.date = now(), board_comment.content = ? WHERE board_comment.comment_id = ?;";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true, result: result });
  });
});

// 게시글 삭제
router.delete("/detail/:post_id", (req, res) => {
  const param = [req.params.post_id];
  // 게시글 삭제 요청을 보낸 user_id와 게시글을 작성한 user_id가 같을 경우 삭제
  // 프론트에서 처리 어떻게?
  // 게시글 삭제시 게시글에 있는 댓글도 같이 삭제해야함
  var sql = "DELETE FROM board_post WHERE board_post.post_id = ?;";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true, result: result });
  });
});

// 댓글 삭제
router.delete("/detail/:post_id/:comment_id", (req, res) => {
  const param = [req.params.comment_id];

  var sql = "DELETE FROM board_comment WHERE comment_id = ?;";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true, result: result });
  });
});

module.exports = router;
