const express = require("express");
const cors = require("cors");
const db = require("./models");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const dotenv = require("dotenv");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const passportConfig = require("./passport");
const passport = require("passport");

const app = express();

dotenv.config();

db.sequelize
    .sync()
    .then(() => {
        console.log("db 연결 성공");
    })
    .catch(console.error);
passportConfig();

app.use(
    cors({
        origin: true,
        credentials: false,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        saveUninitialized: false,
        resave: false,
        secret: process.env.COOKIE_SECRET,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/post", postRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("hello express");
});

app.listen(5000, () => {
    console.log("server is running!!!");
});
