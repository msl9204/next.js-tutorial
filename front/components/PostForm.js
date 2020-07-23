import React, { useCallback, useRef, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
    UPLOAD_IMAGES_REQUEST,
    REMOVE_IMAGE,
    ADD_POST_REQUEST,
} from "../reducers/post";
import useInput from "./hooks/useInput";

export default function PostForm() {
    const { imagePaths, addPostDone } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const [text, onChangeText, setText] = useInput("");
    const imageInput = useRef();

    useEffect(() => {
        if (addPostDone) {
            setText("");
        }
    }, [addPostDone]);

    const onSubmit = useCallback(() => {
        if (!text || !text.trim()) {
            return alert("게시글을 작성하세요.");
        }
        console.log("imagePaths", imagePaths);
        const formData = new FormData();
        imagePaths.forEach((p) => {
            formData.append("image", p);
        });

        formData.append("content", text);
        console.log("text", text);

        console.log(formData);

        return dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
    }, [text, imagePaths]);

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    const onChangeImages = useCallback((e) => {
        const imageFormData = new FormData();
        // 배열의 foreach 메소드를 빌려쓰는 것
        Array.prototype.forEach.call(e.target.files, (f) => {
            // key , value 형식으로 맵핑된다.
            // key값이 image여야 back multer도 인식할 수 있음.
            imageFormData.append("image", f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });
    });

    const onRemoveImage = useCallback((index) => () => {
        dispatch({
            type: REMOVE_IMAGE,
            data: index,
        });
    });

    return (
        <Form
            style={{ margin: "10px 0 20px" }}
            encType="multipart/form-data"
            onFinish={onSubmit}
        >
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="어떤 신기한 일이 있었나요?"
            />
            <div>
                <input
                    type="file"
                    name="image"
                    multiple
                    hidden
                    ref={imageInput}
                    onChange={onChangeImages}
                />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                >
                    짹짹
                </Button>
            </div>
            <div>
                {imagePaths.map((v, i) => (
                    <div key={v} style={{ display: "inline-block" }}>
                        <img
                            src={`http://localhost:5000/${v}`}
                            style={{ width: "200px" }}
                            alt={v}
                        />
                        <div>
                            <Button onClick={onRemoveImage(i)}>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
}
