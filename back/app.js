const express = require("express");
const app = express();
const db = require("./models");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

db.sequelize
    .sync()
    .then(() => {
        console.log("db 연결 성공");
    })
    .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/post", postRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("hello express");
});

app.listen(5000, () => {
    console.log("server is running!!!");
});
