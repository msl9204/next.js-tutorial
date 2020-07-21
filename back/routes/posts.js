const express = require("express");
const { Post, Image, User, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            // limit: 10, // 10개만 가져와라
            // offset: 0, // 0이면 0을 기준으로 10개, 10이면 10을 기준으로 10개
            // // limit Offset 방식은 잘 사용하지 않는다.
            // last id 방식을 많이 사용
            // where: { id: lastId },
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
