const express = require("express");
const { Op } = require("sequelize");
const { Post, Image, User, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const where = {};
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

module.exports = router;
