const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require("sequelize");
const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                // 받고싶은 항목 리스트형식으로 컬럼명 적어두면 뽑아온다.
                // attributes: ["id", "nickname", "email"],
                // exclude로 넣어 두면, 그 항목만 빼고 뽑아온다.
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: Post,
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followings",
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followers",
                        attributes: ["id"],
                    },
                ],
            });
            console.log("FFFFFFF", fullUserWithoutPassword);
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/:userId", async (req, res, next) => {
    try {
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.userId },
            // 받고싶은 항목 리스트형식으로 컬럼명 적어두면 뽑아온다.
            // attributes: ["id", "nickname", "email"],
            // exclude로 넣어 두면, 그 항목만 빼고 뽑아온다.
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: Post,
                    attributes: ["id"],
                },
                {
                    model: User,
                    as: "Followings",
                    attributes: ["id"],
                },
                {
                    model: User,
                    as: "Followers",
                    attributes: ["id"],
                },
            ],
        });

        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            // 개인정보 침해 예방
            data.Posts = data.Posts.length;
            data.Followers = data.Followers.length;
            data.Followings = data.Followings.length;

            res.status(200).json(data);
        } else {
            res.status(200).json("존재하지 않는 유저입니다.");
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/:userId/posts", async (req, res, next) => {
    try {
        const where = { UserId: req.params.userId };
        if (parseInt(req.query.lastId, 10)) {
            // 초기로딩이 아닐 때
            // Op.lt 를 주면 lastId 보다 작은 값을 불러오는 조건이 된다.
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
        }
        const posts = await Post.findAll({
            // limit: 10, // 10개만 가져와라
            // offset: 0, // 0이면 0을 기준으로 10개, 10이면 10을 기준으로 10개
            // // limit Offset 방식은 잘 사용하지 않는다.
            // last id 방식을 많이 사용
            // where: { id: lastId },
            where,
            limit: 10,
            order: [
                ["createdAt", "DESC"],
                [Comment, "createdAt", "DESC"],
            ],
            include: [
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
                { model: Image },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                            order: [["createdAt", "DESC"]],
                        },
                    ],
                },
                { model: User, as: "Likers", attributes: ["id"] },
                {
                    model: Post,
                    as: "Retweet",
                    include: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                        {
                            model: Image,
                        },
                    ],
                },
            ],
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

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
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followings",
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followers",
                        attributes: ["id"],
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
});

router.post("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send("ok");
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });

        if (!user) {
            res.status(403).send("없는 사용자 입니다.");
        }

        await user.addFollower(req.user.id);

        res.status(200).json({
            UserId: parseInt(req.params.userId, 10),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
    // PATCH /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });

        if (!user) {
            res.status(403).send("없는 사용자 입니다.");
        }

        await user.removeFollowers(req.user.id);

        res.status(200).json({
            UserId: parseInt(req.params.userId, 10),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });

        if (!user) {
            res.status(403).send("없는 사용자 입니다.");
        }

        await user.removeFollowings(req.user.id);

        res.status(200).json({
            UserId: parseInt(req.params.userId, 10),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });

        if (!user) {
            res.status(403).send("없는 사용자 입니다.");
        }

        const followers = await user.getFollowers();

        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });

        if (!user) {
            res.status(403).send("없는 사용자 입니다.");
        }

        const followings = await user.getFollowings();
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
