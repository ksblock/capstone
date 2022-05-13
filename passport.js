const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql2');
const conn = require('./config/db_config');

module.exports = () => {
    passport.serializeUser(function(user, done) {
        console.log("serializeUser ", user)
        done(null, user.user_id);
      });
      
    passport.deserializeUser(function(id, done) {
        console.log("deserializeUser id ", id)
        var userinfo;
        //console.log(id);
        var sql = 'SELECT * FROM users where user_id=?';
        conn.query(sql, [id], function(err, result) {
          if(err)
            console.log(err);
          //console.log("deserializeUser mysql result : ", result);
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
};