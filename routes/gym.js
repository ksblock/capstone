const express = require('express');
const path = require('path');
const conn = require('../config/db_config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

//passport 전략 정의
passport.serializeUser(function(user, done) {
    console.log("serializeUser ", user)
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    console.log("deserializeUser id ", id)
    var userinfo;
    var sql = 'SELECT * FROM gym where id=?';
    conn.query(sql, [id], function(err, result) {
      if(err)
        console.log(err);
      console.log("deserializeUser mysql result : ", result);
      var json = JSON.stringify(result[0]);
      userinfo = JSON.parse(json);
      done(null, userinfo);
    })
});
  
passport.use(new LocalStrategy({
      usernameField: 'id',
      passwordField: 'pw'
    },
    function(username, password, done) {
      var sql = 'SELECT * FROM gym WHERE id=? and pw=?';
      conn.query(sql, [username, password], function(err, result) {
        if(err)
          console.log(err);
  
        if(result.length === 0){
          console.log("없는 id");
          return done(null, false, {message: 'Incorrect'});
        }
        else{
          console.log(result);
          var json = JSON.stringify(result[0]);
          var gyminfo = JSON.parse(json);
          console.log("gyminfo" + gyminfo);
          return done(null, gyminfo);
        }
      })
    }
));

//router
//로그인 중이면 해당 페이지로 이동 추가
router.get('/', function (req, res) {
    console.log(req.user);
    if(req.user)
        console.log("test");
    res.send('Hello, Express');
    //res.sendFile(path.join(__dirname, "../public", "gym.html"));
})

router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, "../public/gym", "signup.html"));
})

router.post('/signup', function (req, res) {
    const param = [req.body.name, req.body.host_name, req.body.id, req.body.pw, req.body.phone, 
        req.body.location, req.body.registraion, req.body.large, req.body.small, req.body.event];
      
        var sql = 'INSERT INTO gym VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        conn.query(sql, param, function (err, result) {
          if(err)
          {
            console.log(err);
            return res.redirect('/gym/signup');
          }
        })
      
        res.redirect('/gym/login');
})

router.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, "../public/gym", "login.html"));
})

router.post('/login', passport.authenticate('local', { successRedirect: '/gym',
    failureRedirect: '/gym/login',
    session: true
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;