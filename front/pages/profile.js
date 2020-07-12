import React from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
    const followerList = [
        { nickname: "민수" },
        { nickname: "바보" },
        { nickname: "버드" },
    ];
    const followingList = [
        { nickname: "민수" },
        { nickname: "바보" },
        { nickname: "버드" },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList header="팔로잉 목록" data={followingList} />
                <FollowList header="팔로워 목록" data={followerList} />
            </AppLayout>
        </React.Fragment>
    );
};

export default Profile;
