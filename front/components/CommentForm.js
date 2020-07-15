import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button } from "antd";
import useInput from "./hooks/useInput";
import PropTypes from "prop-types";

export default function CommentForm({ post }) {
    const id = useSelector((state) => state.user.me?.id);

    const [commentText, onChangeCommentText] = useInput("");

    const onSubmitComment = useCallback(() => {
        console.log(post.id, commentText);
    }, [commentText]);

    return (
        <Form onFinish={onSubmitComment}>
            <Form.Item stype={{ position: "relative", margin: 0 }}>
                <Input.TextArea
                    value={commentText}
                    onChange={onChangeCommentText}
                    rows={4}
                />
                <Button type="primary" htmlType="submit">
                    삐약
                </Button>
            </Form.Item>
        </Form>
    );
}

CommentForm.propTypes = {
    post: PropTypes.object.isRequired,
};
