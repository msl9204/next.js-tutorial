import React from "react";
import propTypes from "prop-types";
import Head from "next/head";
import "antd/dist/antd.css";

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

export default NodeBird;
