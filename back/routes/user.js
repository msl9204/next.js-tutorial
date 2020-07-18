const express = require("express");
const { User } = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
    await User.create({
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password,
    });
    res.send("ok");
});

module.exports = router;
