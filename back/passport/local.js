const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email", // req.body에서 가져옴
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({
                        where: { email },
                    });
                    // done 파라미터 순서 => 서버에러, 성공, 클라이언트 에러
                    if (!user) {
                        return done(null, false, {
                            reason: "존재하지 않는 이메일입니다!",
                        });
                    }
                    const result = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (result) {
                        return done(null, user);
                    }

                    return done(null, false, {
                        reason: "비밀번호가 틀렸습니다.",
                    });
                } catch (error) {
                    // 서버에러시 이쪽으로 바로 넘어간다.
                    console.error(error);
                    return done(error);
                }
            }
        )
    );
};
