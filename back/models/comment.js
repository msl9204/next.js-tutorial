module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            // id가 기본적으로 들어있다.
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        // UserId
        // PostId 라는 컬럼이 생긴다. belongsTo 모델에서는
        // 생각해보면 이렇게 되야 맞다.
        {
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci", // 이모티콘 저장
        }
    );

    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };

    return Comment;
};
