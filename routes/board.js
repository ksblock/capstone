const express = require("express");
const { redirect } = require("express/lib/response");
const { appendFile } = require("fs");
const path = require("path");
const conn = require("../config/db_config");

const router = express.Router();

// 게시글 목록
router.get("/list", function (req, res) {
  console.log("test");
  var sql =
    "select board.board_id, board.title, users.nickname, board.date from users, board where board.user_id = users.user_id;";
  conn.query(sql, [], (err, result) => {
    console.log("success");

    res.send(result);
    //res.send(path.join(__dirname, "../public/board", "board.html"), {"result": json});
  });
});

// 개별 게시글 조회
router.get("/detail/:id", function (req, res) {
  const param = [req.params.id];

  var sql =
    "select board.title, board.content, board.large, board.small, board.event, users.nickname from users, board where board.board_id=? and board.user_id=users.user_id;";

  conn.query(sql, param, (err, result) => {
    console.log(result);

    res.send(result);
    //res.send(path.join(__dirname, "../public/board", "board.html"), {"result": json});
  });
});

// 게시글에 달린 댓글 조회
router.get("/detail/:id/reply", (req, res) => {
  const param = [req.params.id];

  var sql_reply =
    "select reply.content, reply.date, users.nickname from users, reply where reply.board_id=? and users.user_id=reply.user_id;";

  conn.query(sql_reply, param, (err, result) => {
    console.log(result);

    res.send(result);
    //res.send(path.join(__dirname, "../public/board", "board.html"), {"result": json});
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
    req.body.large,
    req.body.small,
    req.body.event,
  ];
  //var sql = "insert into board (date, title, content) values(now(), ?, ?);";
  var sql = "insert into board values(NULL, now(), ?, ?, ?, ?, ?, ?);";
  conn.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true });
  });
});

// 해당하는 게시글의 댓글 작성
router.post("/detail/:id/writeReply", (req, res) => {
  const param = [req.params.id, req.body.user_id, req.body.content];
  //DB column 순서 주의
  var sql = "insert into reply values(NULL, ?, ?, ?, now());";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true });
  });
});

// 게시글 삭제
router.delete("/detail/:id", (req, res) => {
  const param = [req.params.id, req.body.user_id];
  // 게시글 삭제 요청을 보낸 user_id와 게시글을 작성한 user_id가 같을 경우 삭제
  // 프론트에서 처리 어떻게?
  var sql = "DELETE FROM board WHERE board.board_id = ? and board.user_id = ?;";

  conn.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true, result: result });
  });
});

module.exports = router;
