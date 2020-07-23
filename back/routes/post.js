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

module.exports = router;
