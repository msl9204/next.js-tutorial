import React from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { END } from "redux-saga";

import { Avatar, Card } from "antd";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST } from "../reducers/user";

export default function about() {
    const { userInfo } = useSelector((state) => state.user);

    return (
        <AppLayout>
            <Head>
                <title>Soo | Node Bird</title>
            </Head>
            {userInfo ? (
                <Card
                    actions={[
                        <div key="twit">
                            짹짹
                            <br />
                            {userInfo.Posts}
                        </div>,
                        <div key="following">
                            팔로잉
                            <br />
                            {userInfo.Followings}
                        </div>,
                        <div key="follower">
                            팔로워
                            <br />
                            {userInfo.Followers}
                        </div>,
                    ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                        description="노드버드 매니아"
                    />
                </Card>
            ) : null}
        </AppLayout>
    );
}
// 언제 접속해도 데이터가 바뀔일이 없다 -> getStaticProps -> 완전 정적인 파일로 bulid 하는 것.
// 접속할 때 마다 화면이 바뀌어야 하면 -> getServerSideProps
export const getStaticProps = wrapper.getStaticProps(async (context) => {
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: 1,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});
