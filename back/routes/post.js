const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const { isLoggedIn } = require("./middlewares");
const { User, Post, Image, Comment, Hashtag } = require("../models");
const { createCipher } = require("crypto");

try {
    fs.accessSync("uploads");
} catch (error) {
    console.log("uploads 폴더가 없으므로 생성합니다.");
    fs.mkdirSync("uploads");
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads");
        },
        filename(req, file, done) {
            //제로초.png
            const ext = path.extname(file.originalname); // 확장자 추출(.png)
            const basename = path.basename(file.originalname, ext); // 제로초

            done(null, basename + "_" + new Date().getTime() + ext); // 제로초1518471232.png (중복이 안되게 시간태그를 붙여주는 것)
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB 제한,
});

// 모델을 이용한 것들의 전체적인 흐름은 검사를 할만큼 하고 -> response 보내준다.

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        if (hashtags) {
            const result = await Promise.all(
                hashtags.map((tag) =>
                    // 있으면 가져오고, 없으면 등록한다.
                    Hashtag.findOrCreate({
                        where: { name: tag.slice(1).toLowerCase() },
                    })
                )
            );

            await post.addHashtags(result.map((v) => v[0]));
        }

        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                // 이미지를 여러개 올리면 image : [제로초.png, 부기초.png]
                const images = await Promise.all(
                    req.body.image.map((image) => Image.create({ src: image }))
                );
                await post.addImages(images);
            } else {
                // 이미지를 하나만 올리면 image : 제로초.png
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }

        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [
                {
                    model: Image,
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User, // 댓글 작성자
                            attributes: ["id", "nickname"],
                        },
                    ],
                },
                { model: User, attributes: ["id", "nickname"] }, // 게시글 작성자
                { model: User, as: "Likers", attributes: ["id"] }, // 좋아요 누른 사람
            ],
        });

        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post(
    "/images",
    isLoggedIn,
    upload.array("image"),
    async (req, res, next) => {
        console.log(req.files);
        res.json(req.files.map((v) => v.filename));
    }
);

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });

        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다.");
        }

        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id,
        });

        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
            ],
        });

        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
    // PATCH /post/1/like
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });

        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }

        await post.addLikers(req.user.id);
        res.json({ postId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
    // DELETE /post/1/like
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });

        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }

        await post.removeLikers(req.user.id);
        res.json({ postId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
    try {
        await Post.destroy({
            where: { id: req.params.postId, UserId: req.user.id },
        });

        res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/:postId", async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });

        if (!post) {
            return res.status(404).send("존재하지 않는 게시글입니다.");
        }
        // 자기 게시글 리트윗한거 리트윗 안되게 + 남이 자기 게시들 리트윗한거 내가 리트윗 못하게

        const fullPost = await Post.findOne({
            where: { id: post.id },
            // 여기는 어떤 게시글을 리트윗했는지
            include: [
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
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
                {
                    model: User,
                    as: "Likers",
                    attributes: ["id", "nickname"],
                },
                {
                    model: Image,
                },
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

        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [
                // 이렇게 해주면 post에 post.Retweet 이 생긴다.
                {
                    model: Post,
                    as: "Retweet",
                },
            ],
        });

        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다.");
        }
        // 자기 게시글 리트윗한거 리트윗 안되게 + 남이 자기 게시들 리트윗한거 내가 리트윗 못하게
        if (
            req.user.id === post.UserId ||
            (post.Retweet && post.Retweet.UserId === req.user.id)
        ) {
            return res.status(403).send("자신의 글은 리트윗 할 수 없습니다.");
        }
        // 리트윗 아이디 얻어오기. 리트윗이 한번도 되지 않았을 때, post.id 가져와야함.
        const retweetTargetId = post.RetweetId || post.id;
        // 두번 리트윗 방지.
        const exPost = await Post.findOne({
            where: { UserId: req.user.id },
            RetweetId: retweetTargetId,
        });
        if (exPost) {
            return res.status(403).send("이미 리트윗 했습니다.");
        }

        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: "retweet",
        });

        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            // 여기는 어떤 게시글을 리트윗했는지
            include: [
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
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
                {
                    model: Image,
                },
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

        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
