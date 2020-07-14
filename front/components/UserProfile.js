import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import { useDispatch } from "react-redux";
import { logoutAction } from "../reducers/user";

export default function UserProfile() {
    const dispatch = useDispatch();
    const onLogout = useCallback(() => {
        dispatch(logoutAction());
    }, []);

    return (
        <Card
            actions={[
                <div key="twit">
                    짹짹
                    <br />0
                </div>,
                <div key="followings">
                    팔로잉
                    <br />0
                </div>,
                <div key="followers">
                    팔로워
                    <br />0
                </div>,
            ]}
        >
            <Card.Meta avatar={<Avatar>MS</Avatar>} title="MS" />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>
    );
}
