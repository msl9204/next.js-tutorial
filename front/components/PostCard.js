import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Card, Popover, Button, Avatar, List, Comment } from "antd";
import {
    RetweetOutlined,
    HeartOutlined,
    MessageOutlined,
    EllipsisOutlined,
    HeartTwoTone,
} from "@ant-design/icons";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import {
    REMOVE_POST_REQUEST,
    LIKE_POST_REQUEST,
    UNLIKE_POST_REQUEST,
    RETWEET_REQUEST,
} from "../reducers/post";
import FollowButton from "./FollowButton";
import PostCardContent from "./PostCardContent";
import Link from "next/link";
import moment from "moment";

moment.locale("ko");

export default function PostCard({ post }) {
    const dispatch = useDispatch();
    const { removePostLoading } = useSelector((state) => state.post);
    const [commentFormOpend, setCommentFormOpend] = useState(false);

    const id = useSelector((state) => state.user.me?.id);
    const liked = post.Likers.find((v) => v.id === id);

    const onLike = useCallback(() => {
        if (!id) {
            alert("로그인이 필요합니다.");
        }

        return dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onUnlike = useCallback(() => {
        if (!id) {
            alert("로그인이 필요합니다.");
        }

        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpend((prev) => !prev);
    }, []);

    const onRemovePost = useCallback(() => {
        if (!id) {
            alert("로그인이 필요합니다.");
        }

        return dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onRetweet = useCallback(() => {
        if (!id) {
            alert("로그인이 필요합니다.");
        }

        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, []);

    return (
        <div style={{ marginBottom: 20 }}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" onClick={onRetweet} />,
                    liked ? (
                        <HeartTwoTone
                            twoToneColor="#eb2f96"
                            key="heart"
                            onClick={onUnlike}
                        />
                    ) : (
                        <HeartOutlined key="heart" onClick={onLike} />
                    ),
                    <MessageOutlined key="comment" onClick={onToggleComment} />,
                    <Popover
                        key="more"
                        content={
                            <Button.Group>
                                {id && post.User.id === id ? (
                                    <React.Fragment>
                                        <Button>수정</Button>
                                        <Button
                                            type="danger"
                                            loading={removePostLoading}
                                            onClick={onRemovePost}
                                        >
                                            삭제
                                        </Button>
                                    </React.Fragment>
                                ) : (
                                    <Button>신고</Button>
                                )}
                            </Button.Group>
                        }
                    >
                        <EllipsisOutlined />
                    </Popover>,
                ]}
                title={
                    post.RetweetId
                        ? `${post.User.nickname} 님이 리트윗 하셨습니다.`
                        : null
                }
                extra={id && <FollowButton post={post} />}
            >
                {post.RetweetId && post.RetweetId ? (
                    <Card
                        cover={
                            post.Retweet.Images[0] && (
                                <PostImages images={post.Retweet.Images} />
                            )
                        }
                    >
                        <div style={{ float: "right" }}>
                            {moment(post.createdAt).format("YYYY.MM.DD")}
                        </div>
                        <Card.Meta
                            avatar={
                                <Link href={`/user/${post.Retweet.User.id}`}>
                                    <a>
                                        <Avatar>{post.User.nickname[0]}</Avatar>
                                    </a>
                                </Link>
                            }
                            title={post.Retweet.User.nickname}
                            description={
                                <PostCardContent
                                    postData={post.Retweet.content}
                                />
                            }
                        />
                    </Card>
                ) : (
                    <React.Fragment>
                        <div style={{ float: "right" }}>
                            {moment(post.createdAt).format("YYYY.MM.DD")}
                        </div>

                        <Card.Meta
                            avatar={
                                <Link href={`/user/${post.User.id}`}>
                                    <a>
                                        <Avatar>{post.User.nickname[0]}</Avatar>
                                    </a>
                                </Link>
                            }
                            title={post.User.nickname}
                            description={
                                <PostCardContent postData={post.content} />
                            }
                        />
                    </React.Fragment>
                )}
            </Card>
            {commentFormOpend && (
                <div>
                    <CommentForm post={post} />
                    <List
                        header={`${post.Comments.length}개의 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.nickname}
                                    avatar={
                                        <Link href={`/user/${item.User.id}`}>
                                            <a>
                                                <Avatar>
                                                    {item.User.nickname[0]}
                                                </Avatar>
                                            </a>
                                        </Link>
                                    }
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>
            )}
        </div>
    );
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any),
    }).isRequired,
};
