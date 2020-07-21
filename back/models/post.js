module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        "Post",
        {
            // id가 기본적으로 들어있다.
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci", // 이모티콘 저장
        }
    );

    Post.associate = (db) => {
        db.Post.belongsTo(db.User); // post.addUser post.getUser post.setUser
        db.Post.belongsToMany(db.Hashtag, { through: "HashtagPost" });
        db.Post.hasMany(db.Comment); // 관계를 설정하면 아래처럼 생성해준다.
        db.Post.hasMany(db.Image); // post.addImages post.getImages
        db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
        // post.addLiker, post.removeLikers
        db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
    };

    return Post;
};
