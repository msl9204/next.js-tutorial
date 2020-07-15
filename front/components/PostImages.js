import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "./ImagesZoom";

export default function PostImages({ images }) {
    const [showImageZoom, setShowImageZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImageZoom(true);
    }, []);

    const onClose = useCallback(() => {
        setShowImageZoom(false);
    }, []);

    if (images.length === 1) {
        return (
            <React.Fragment>
                <img
                    role="presentation"
                    src={images[0].src}
                    alt={images[0].src}
                    onClick={onZoom}
                />
                {showImageZoom && (
                    <ImagesZoom images={images} onClose={onClose} />
                )}
            </React.Fragment>
        );
    }

    if (images.length === 2) {
        return (
            <React.Fragment>
                <img
                    role="presentation"
                    style={{ width: "50%", display: "inline-block" }}
                    src={images[0].src}
                    alt={images[0].src}
                    onClick={onZoom}
                />
                <img
                    role="presentation"
                    style={{ width: "50%", display: "inline-block" }}
                    src={images[1].src}
                    alt={images[1].src}
                    onClick={onZoom}
                />
                {showImageZoom && (
                    <ImagesZoom images={images} onClose={onClose} />
                )}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div>
                <img
                    role="presentation"
                    style={{ width: "50%" }}
                    src={images[0].src}
                    alt={images[0].src}
                    onClick={onZoom}
                />
                <div
                    role="presentation"
                    style={{
                        display: "inline-block",
                        width: "50%",
                        textAlign: "center",
                        verticalAlign: "middle",
                    }}
                    onClick={onZoom}
                >
                    <PlusOutlined />
                    <br />
                    {images.length - 1} 개의 사진 더보기
                </div>
            </div>
            {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
        </React.Fragment>
    );
}

PostImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object),
};
