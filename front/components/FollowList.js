import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Button, List, Card } from "antd";
import { StopOutlined } from "@ant-design/icons";
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from "../reducers/user";

export default function FollowList({ header, data }) {
    const dispatch = useDispatch();
    // 반복문 안에서 인수받고 싶으면 고차함수를 이용하면 좋다. 팔로/언팔로 18분경
    const onCancel = (id) => () => {
        if (header === "팔로잉") {
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: id,
            });
        }

        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: id,
        });
    };

    return (
        <List
            style={{ marginBottom: 20 }}
            grid={{ gutter: 4, xs: 2, md: 3 }}
            size="small"
            header={<div>{header}</div>}
            loadMore={
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                    <Button>더 보기</Button>
                </div>
            }
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item style={{ marginTop: 20 }}>
                    <Card
                        actions={[
                            <StopOutlined
                                key="stop"
                                onClick={onCancel(item.id)}
                            />,
                        ]}
                    >
                        <Card.Meta description={item.nickname} />
                    </Card>
                </List.Item>
            )}
        />
    );
}

FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
};
