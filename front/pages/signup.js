import React, { useState, useCallback, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import Router from "next/router";
import { Form, Input, Checkbox, Button } from "antd";
import useInput from "../components/hooks/useInput";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import axios from "axios";

const ErrorMessage = styled.div`
    color: red;
`;

const Signup = () => {
    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [email, onChangeEmail] = useInput("");
    const [nickname, onChangeNick] = useInput("");
    const [password, onChangePassword] = useInput("");

    const dispatch = useDispatch();
    const { signUpLoading, signUpDone, signUpError, me } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (me && me.id) {
            Router.replace("/");
        }
    }, [me && me.id]);

    useEffect(() => {
        if (signUpDone) {
            Router.replace("/");
        }
    }, [signUpDone]);

    useEffect(() => {
        if (signUpError) {
            alert(signUpError);
        }
    }, [signUpError]);

    const onChangePasswordCheck = useCallback(
        (e) => {
            setPasswordCheck(e.target.value);
            setPasswordError(e.target.value !== password);
        },
        [password]
    );

    const [term, setTerm] = useState(false);
    const [termError, setTermError] = useState(false);
    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    });

    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) {
            return setPasswordError(true);
        }

        if (!term) {
            return setTermError(true);
        }
        console.log(email, nickname, password);
        dispatch({
            type: SIGN_UP_REQUEST,
            data: { email, password, nickname },
        });
    }, [email, password, passwordCheck, term]);

    return (
        <React.Fragment>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>
            <AppLayout>
                <Form onFinish={onSubmit}>
                    <div>
                        <label htmlFor="user-email">이메일</label>
                        <br />
                        <Input
                            name="user-email"
                            type="email"
                            value={email}
                            required
                            onChange={onChangeEmail}
                        />
                    </div>
                    <div>
                        <label htmlFor="user-nick">닉네임</label>
                        <br />
                        <Input
                            name="user-nick"
                            value={nickname}
                            required
                            onChange={onChangeNick}
                        />
                    </div>
                    <div>
                        <label htmlFor="user-password">비밀번호</label>
                        <br />
                        <Input
                            name="user-password"
                            value={password}
                            required
                            type="password"
                            onChange={onChangePassword}
                        />
                    </div>
                    <div>
                        <label htmlFor="user-password-check">
                            비밀번호체크
                        </label>
                        <br />
                        <Input
                            name="user-password-check"
                            value={passwordCheck}
                            required
                            type="password"
                            onChange={onChangePasswordCheck}
                        />
                        {passwordError && (
                            <ErrorMessage>
                                비밀번호가 일치하지 않습니다.
                            </ErrorMessage>
                        )}
                    </div>
                    <div>
                        <Checkbox
                            name="user-term"
                            checked={term}
                            onChange={onChangeTerm}
                        >
                            동의하십니까?
                        </Checkbox>
                        {termError && (
                            <ErrorMessage>
                                약관에 동의하셔야 합니다.
                            </ErrorMessage>
                        )}
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={signUpLoading}
                        >
                            가입하기
                        </Button>
                    </div>
                </Form>

                <div>회원가입 페이지</div>
            </AppLayout>
        </React.Fragment>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(
    async (context) => {
        // 프론트 서버에서 백앤드로 쿠키를 보내줘야 현재 로그인된 사용자를 인식할 수 있다.
        const cookie = context.req ? context.req.headers.cookie : "";
        axios.defaults.headers.Cookie = "";

        // 다른 사람이 로그인 되는 현상을 막으려면 이 코드가 필요함.
        // 쿠키써서 요청 보낼때만 쿠키를 axios 헤더에 넣어줌.
        if (context.req && cookie) {
            axios.defaults.headers.Cookie = cookie;
        }

        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
        });

        // 아래부분이 있어서 REQUEST -> SUCCESS 될때까지 기다린 후 랜더링된다.
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);

export default Signup;
