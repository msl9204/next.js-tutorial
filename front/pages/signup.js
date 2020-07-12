import React from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";

const Signup = () => {
    return (
        <React.Fragment>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>
            <AppLayout>
                <div>회원가입 페이지</div>
            </AppLayout>
        </React.Fragment>
    );
};

export default Signup;
