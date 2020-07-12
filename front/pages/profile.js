import React from "react";
import AppLayout from "../components/AppLayout";

import Head from "next/head";

const Profile = () => {
    return (
        <React.Fragment>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <div>프로필</div>
            </AppLayout>
        </React.Fragment>
    );
};

export default Profile;
