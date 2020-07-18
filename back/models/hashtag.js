module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define(
        "Hashtag",
        {
            // id가 기본적으로 들어있다.
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        },
        {
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci", // 이모티콘 저장
        }
    );
    // 다대다 관계의 테이블은 새로운 테이블이 생긴다.
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through: "HashtagPost" });
    };

    return Hashtag;
};
