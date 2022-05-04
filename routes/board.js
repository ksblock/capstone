const express = require('express');
const { appendFile } = require('fs');
const path = require('path');
const conn = require('../config/db_config');

const router = express.Router();

router.get('/', function(req, res) {
    console.log("test");
    var sql = 'select board.board_id, board.title, users.nickname, board.date from users, board where board.user_id = users.user_id;';
    conn.query(sql, [], (err, result) => {
        console.log("success");

        var json = JSON.stringify(result);

        console.log(json);
        console.log(typeof(json));
        
        res.send(json);
        //res.sendFile(path.join(__dirname, "../public/board", "board.html"), {"result": json});
    })
})

module.exports = router;