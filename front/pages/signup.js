import React, { useState, useCallback, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import Router from "next/router";
import { Form, Input, Checkbox, Button } from "antd";
import useInput from "../components/hooks/useInput";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";

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

export default Signup;
