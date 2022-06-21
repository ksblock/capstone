const express = require("express");
const app = express();
const mysql = require("mysql");
const PORT = process.env.port || 8000;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "goszhr0926!@",
    database: "test",
});

app.get("/", (req, res) => {
    const sqlQuery = "INSERT INTO requested (rowno) VALUES (1)";
    db.query(sqlQuery, (err, result) => {
        res.send("success!");
    });
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
