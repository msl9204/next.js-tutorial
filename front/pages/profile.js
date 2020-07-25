import React, { useEffect, useState, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useSelector } from "react-redux";
import Router from "next/router";
import { END } from "redux-saga";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import axios from "axios";
import wrapper from "../store/configureStore";
import useSWR from "swr";

const fetcher = (url) =>
    axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
    const { me } = useSelector((state) => state.user);

    const [followersLimit, setFollowersLimit] = useState(3);
    const [followingsLimit, setFollowingsLimit] = useState(3);

    // swr에서 loading 상태는 데이터도 없고, 에러도 없는 상태일 때!
    const { data: followerData, error: followerError } = useSWR(
        `http://localhost:5000/user/followers?limit=${followersLimit}`,
        fetcher
    );

    const { data: followingData, error: followingError } = useSWR(
        `http://localhost:5000/user/followings?limit=${followingsLimit}`,
        fetcher
    );

    useEffect(() => {
        if (!(me && me.id)) {
            Router.push("/");
        }
    }, [me && me.id]);

    const loadMoreFollowings = useCallback(() => {
        setFollowingsLimit((prev) => prev + 3);
    }, []);

    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit((prev) => prev + 3);
    }, []);

    if (!me) {
        return "내 정보 로딩중...";
    }

    if (followerError || followingError) {
        console.error(followerError || followingError);
        return <div>팔로잉/팔로워 로딩 중 에러가 발생하였습니다.</div>;
    }

    return (
        <React.Fragment>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList
                    header="팔로잉 목록"
                    data={followingData}
                    onClickMore={loadMoreFollowings}
                    loading={!followingData && !followingError}
                />
                <FollowList
                    header="팔로워 목록"
                    data={followerData}
                    onClickMore={loadMoreFollowers}
                    loading={!followerData && !followerError}
                />
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

export default Profile;
