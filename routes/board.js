const express = require('express');
const { redirect } = require('express/lib/response');
const { appendFile } = require('fs');
const path = require('path');
const conn = require('../config/db_config');

const router = express.Router();

router.get('/list', function(req, res) {
    console.log("test");
    var sql = 'select board.board_id, board.title, users.nickname, board.date from users, board where board.user_id = users.user_id;';
    conn.query(sql, [], (err, result) => {
        console.log("success");

        var json = JSON.stringify(result);

        console.log(json);
        console.log(typeof(json));
        
        res.send(json);
        //res.send(path.join(__dirname, "../public/board", "board.html"), {"result": json});
    })
})

router.get('/detail/:id', function(req, res) {

    const param = [req.params.id];
    
    var sql = "select board.title, board.content, board.large, board.small, board.event, users.nickname from users, board where board.board_id=? and board.user_id=users.user_id;"
    
    conn.query(sql, param, (err, result) => {
        console.log(result);
        console.log(req.params.id);

        var json = JSON.stringify(result);

        console.log(json);
        console.log(typeof(json));
        
        res.send(json);
        //res.send(path.join(__dirname, "../public/board", "board.html"), {"result": json});
    })
    
}) 

router.get('/detail/:id/reply', (req, res) => {
    const param = [req.params.id];

    var sql_reply = "select reply.content, reply.date, users.nickname from users, reply where reply.board_id=? and users.user_id=reply.user_id;"
    
    conn.query(sql_reply, param, (err, result) => {
        var json = JSON.stringify(result);

        console.log(json);
        console.log(typeof(json));

        res.send(json);
        //res.send(path.join(__dirname, "../public/board", "board.html"), {"result": json});
    })
})

router.get('/write', (req, res) => {
    res.send("write board")
})

router.post('/write', (req, res) => {
    const params = [req.body.user_id, req.body.title, req.body.content, req.body.large, req.body.small, req.body.event];
    var sql = "insert into board values(NULL, now(), ?, ?, ?, ?, ?, ?);"
    
    conn.query(sql, params, (err, result) => {
        if(err)
        {
            console.log(err);
            return res.redirect('/board/write');
        }
        res.redirect('/board/list');
    })
})

router.post('/detail/:id/writeReply', (req, res) => {
    const param = [req.params.id, req.body.user_id, req.body.content];
    var sql = "insert into reply values(NULL, now(), ?, ?, ?);";

    conn.query(sql, param, (err, result) => {
        if(err)
        {
            console.log(err);
            return res.redirect('/board/list');
        }
        res.redirect('/board/detail/' + req.params.id);
    })
})

module.exports = router;