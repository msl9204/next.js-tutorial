import React from "react";
import propTypes from "prop-types";
import Head from "next/head";
import "antd/dist/antd.css";
import wrapper from "../store/configureStore";
import withReduxSaga from "next-redux-saga";

const NodeBird = ({ Component }) => {
    return (
        <React.Fragment>
            <Head>
                <meta charSet="utf-8" />
                <title>NodeBird</title>
            </Head>
            <Component />
        </React.Fragment>
    );
};

NodeBird.propTypes = {
    Component: propTypes.elementType.isRequired,
};

export default wrapper.withRedux(withReduxSaga(NodeBird));
