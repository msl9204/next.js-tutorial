const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

// err,user,info는 passport strategy done 부분 콜백.
// 아래 패턴이 미들웨어 확장 패턴
router.post("/login", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }

        if (info) {
            return res.status(401).send(info.reason);
        }

        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }

            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                // 받고싶은 항목 리스트형식으로 컬럼명 적어두면 뽑아온다.
                // attributes: ["id", "nickname", "email"],
                // exclude로 넣어 두면, 그 항목만 빼고 뽑아온다.
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: Post,
                    },
                    {
                        model: User,
                        as: "Followings",
                    },
                    {
                        model: User,
                        as: "Followers",
                    },
                ],
            });

            return res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next);
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (exUser) {
            return res.status(403).send("이미 사용중인 아이디입니다.");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        res.status(201).send("ok");
    } catch (error) {
        console.error(error);
        next(error); // status 500
    }

    router.post("/logout", isLoggedIn, (req, res) => {
        req.logout();
        req.session.destroy();
        res.send("ok");
    });
});

module.exports = router;
