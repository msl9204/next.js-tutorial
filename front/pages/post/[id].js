import React from "react";
import { END } from "redux-saga";
import { useRouter } from "next/router";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { useSelector } from "react-redux";
import Head from "next/head";

export default function Post() {
    const router = useRouter();
    const { id } = router.query;
    const { singlePost } = useSelector((state) => state.post);

    // getStaticProps로 처리하는 경우에서 fallback : true 일때,
    // if(router.isFallback){
    //     return <div>로딩중...</div>
    // }

    return (
        <AppLayout>
            <Head>
                <title>{singlePost.User.nickname}님의 글</title>
                <meta name="description" content={singlePost.content} />
                <meta
                    property="og:title"
                    content={`${singlePost.User.nickname}님의 게시글`}
                />
                <meta property="og:description" content={singlePost.content} />
                <meta
                    property="og:image"
                    content={
                        singlePost.Images[0]
                            ? singlePost.Images[0].src
                            : "http://localhost:3000/favicon.ico"
                    }
                />
                <meta
                    property="og:url"
                    content={`https://nodebird.com/post/${id}`}
                />
            </Head>
            <PostCard post={singlePost} />
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
            type: LOAD_MY_INFO_REQUEST,
        });
        context.store.dispatch({
            type: LOAD_POST_REQUEST,
            data: context.params.id,
        });

        // 아래부분이 있어서 REQUEST -> SUCCESS 될때까지 기다린 후 랜더링된다.
        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }
);
// getStaticPaths example
// 미리 static으로 만들기 위해서는 관련된 정보들이 필요하다.
// 모든 정보들을 이렇게 해주기 어려우므로 (미리 페이지를 생성하는 것이라서) 정적인 페이지만 이렇게 처리하는게 좋다.
// export async function getStaticPaths() {
//     return {
//         paths: [{ params: { id: "40" } }],
//         fallback: true,
//     };
// }

// export const getStaticProps = wrapper.getStaticProps(async (context) => {
//     // 프론트 서버에서 백앤드로 쿠키를 보내줘야 현재 로그인된 사용자를 인식할 수 있다.
//     const cookie = context.req ? context.req.headers.cookie : "";
//     axios.defaults.headers.Cookie = "";

//     // 다른 사람이 로그인 되는 현상을 막으려면 이 코드가 필요함.
//     // 쿠키써서 요청 보낼때만 쿠키를 axios 헤더에 넣어줌.
//     if (context.req && cookie) {
//         axios.defaults.headers.Cookie = cookie;
//     }

//     context.store.dispatch({
//         type: LOAD_MY_INFO_REQUEST,
//     });
//     context.store.dispatch({
//         type: LOAD_POST_REQUEST,
//         data: context.params.id,
//     });

//     // 아래부분이 있어서 REQUEST -> SUCCESS 될때까지 기다린 후 랜더링된다.
//     context.store.dispatch(END);
//     await context.store.sagaTask.toPromise();
// });
