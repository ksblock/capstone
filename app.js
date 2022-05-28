const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportConfig = require("./passport");
const conn = require("./config/db_config");
const cors = require("./cors"); //교차통신 모듈 호출

dotenv.config();

const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const boardRouter = require("./routes/board");
const accountRouter = require("./routes/account");
const gymRouter = require("./routes/gym");
const mypageRouter = require("./routes/mypage");
const reservationRouter = require("./routes/reservation");

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      // domain: "192.168.0.102",
      // sameSite: "none",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

//교차통신 적용
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origins: [
      "http://192.168.0.102:8080",
      "http://192.168.35.157:8080",
      "http://localhost:8080",
    ],
  })
);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter);
app.use("/account", accountRouter);
app.use("/gym", gymRouter);
app.use("/mypage", mypageRouter);
app.use("/reservation", reservationRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
