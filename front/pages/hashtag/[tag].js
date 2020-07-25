import React, { useEffect } from "react";
import { END } from "redux-saga";
import { useRouter } from "next/router";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import { useSelector, useDispatch } from "react-redux";

import PostCard from "../../components/PostCard";

export default function Hashtag() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { tag } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
        (state) => state.post
    );

    useEffect(() => {
        const onScroll = () => {
            if (
                window.scrollY + document.documentElement.clientHeight >
                document.documentElement.scrollHeight - 300
            ) {
                if (hasMorePosts && !loadPostsLoading) {
                    dispatch({
                        type: LOAD_HASHTAG_POSTS_REQUEST,
                        lastId:
                            mainPosts[mainPosts.length - 1] &&
                            mainPosts[mainPosts.length - 1].id,
                        data: tag,
                    });
                }
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [mainPosts.length, hasMorePosts, tag, loadPostsLoading]);

    return (
        <AppLayout>
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
        console.log("CONTEXT===========", context);
        axios.defaults.headers.Cookie = "";

        // 다른 사람이 로그인 되는 현상을 막으려면 이 코드가 필요함.
        // 쿠키써서 요청 보낼때만 쿠키를 axios 헤더에 넣어줌.
        if (context.req && cookie) {
            axios.defaults.headers.Cookie = cookie;
        }

        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
        });
        context.store.dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: context.params.tag,
        });

        // 아래부분이 있어서 REQUEST -> SUCCESS 될때까지 기다린 후 랜더링된다.
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);
