import React, { useEffect } from "react";
import { END } from "redux-saga";
import { useRouter } from "next/router";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import { useSelector, useDispatch } from "react-redux";
import Head from "next/head";
import { Card, Avatar } from "antd";
import PostCard from "../../components/PostCard";
export default function User() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
        (state) => state.post
    );
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        const onScroll = () => {
            if (
                window.scrollY + document.documentElement.clientHeight >
                document.documentElement.scrollHeight - 300
            ) {
                if (hasMorePosts && !loadPostsLoading) {
                    dispatch({
                        type: LOAD_USER_POSTS_REQUEST,
                        lastId:
                            mainPosts[mainPosts.length - 1] &&
                            mainPosts[mainPosts.length - 1].id,
                        data: id,
                    });
                }
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [mainPosts.length, hasMorePosts, id, loadPostsLoading]);

    return (
        <AppLayout>
            <Head>
                <title>{userInfo.nickname}님의 글</title>
                <meta
                    name="description"
                    content={`${userInfo.nickname}님의 게시글`}
                />
                <meta
                    property="og:title"
                    content={`${userInfo.nickname}님의 게시글`}
                />
                <meta
                    property="og:description"
                    content={`${userInfo.nickname}님의 게시글`}
                />
                <meta
                    property="og:image"
                    content={"http://localhost:3000/favicon.ico"}
                />
                <meta
                    property="og:url"
                    content={`https://nodebird.com/post/${id}`}
                />
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
                    />
                </Card>
            ) : null}
            {mainPosts.map((c) => (
                <PostCard key={c.id} post={c} />
            ))}
        </AppLayout>
    );
}

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
            type: LOAD_USER_POSTS_REQUEST,
            data: context.params.id,
        });
        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
            data: context.params.id,
        });
        context.store.dispatch({
            type: LOAD_USER_REQUEST,
            data: context.params.id,
        });

        // 아래부분이 있어서 REQUEST -> SUCCESS 될때까지 기다린 후 랜더링된다.
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);
