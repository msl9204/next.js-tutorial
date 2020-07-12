import React, { useState, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { Form, Input, Checkbox, Button } from "antd";
import useInput from "../components/hooks/useInput";
import styled from "styled-components";

const ErrorMessage = styled.div`
    color: red;
`;

const Signup = () => {
    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [id, onChangeId] = useInput("");
    const [nick, onChangeNick] = useInput("");
    const [password, onChangePassword] = useInput("");

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

        console.log(id, nick, password);
    }, [password, passwordCheck, term]);

    return (
        <React.Fragment>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>
            <AppLayout>
                <Form onFinish={onSubmit}>
                    <div>
                        <label htmlFor="user-id">아이디</label>
                        <br />
                        <Input
                            name="user-id"
                            value={id}
                            required
                            onChange={onChangeId}
                        />
                    </div>
                    <div>
                        <label htmlFor="user-nick">닉네임</label>
                        <br />
                        <Input
                            name="user-nick"
                            value={nick}
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
                        <Button type="primary" htmlType="submit">
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
