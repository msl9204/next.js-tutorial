import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import axios from "axios";

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const {
        mainPosts,
        hasMorePosts,
        loadPostsLoading,
        retweetError,
    } = useSelector((state) => state.post);

    useEffect(() => {
        if (retweetError) {
            alert(retweetError);
        }
    }, [retweetError]);

    useEffect(() => {
        function onScoll() {
            if (
                window.scrollY + document.documentElement.clientHeight >
                document.documentElement.scrollHeight - 300
            ) {
                if (hasMorePosts && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId,
                    });
                }
            }
        }

        window.addEventListener("scroll", onScoll);

        return () => {
            window.removeEventListener("scroll", onScoll);
        };
    }, [hasMorePosts, loadPostsLoading]);

    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </AppLayout>
    );
};

// 프론트 서버에서 백앤드 서버로 요청하는 부분
// 사용자가 페이지를 불러올 때, 데이터도 채운 상태로 보내기 위해 이부분이 Home Component 보다 먼저 호출됨
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

        console.log("context", context);

        context.store.dispatch({
            type: LOAD_MY_INFO_REQUEST,
        });
        context.store.dispatch({
            type: LOAD_POSTS_REQUEST,
        });
        // 아래부분이 있어서 REQUEST -> SUCCESS 될때까지 기다린 후 랜더링된다.
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);

export default Home;
