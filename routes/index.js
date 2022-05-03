const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const conn = require('../config/db_config');

const router = express.Router();

//passport 정의
passport.serializeUser(function(user, done) {
  console.log("serializeUser ", user)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializeUser id ", id)
  var userinfo;
  var sql = 'SELECT * FROM users where id=?';
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
    var sql = 'SELECT * FROM users WHERE id=? and pw=?';
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
        var userinfo = JSON.parse(json);
        console.log("userinfo" + userinfo);
        return done(null, userinfo);
      }
    })
  }
));

// GET / 라우터
router.get('/', (req, res) => {
  res.send('Hello, Express');
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user", "signup.html"));
});

router.post('/signup', function (req, res, next) {
  const param = [req.body.name, req.body.nickname, req.body.id, req.body.pw, req.body.large,
  req.body.small, req.body.event];

  var sql = 'INSERT INTO users VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)';
  conn.query(sql, param, function (err, result) {
    if(err)
    {
      console.log(err);
      return res.redirect('/signup');
    }
  })

  res.redirect('/login');
})

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, "../public/user", "login.html"));
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login'})
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

module.exports = router;