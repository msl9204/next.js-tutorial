import axios from "axios";
import { all, fork, put, takeLatest, throttle, call } from "redux-saga/effects";
import {
    ADD_COMMENT_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_POST_FAILURE,
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS,
    REMOVE_POST_REQUEST,
    REMOVE_POST_SUCCESS,
    REMOVE_POST_FAILURE,
    LOAD_POSTS_REQUEST,
    LOAD_POSTS_SUCCESS,
    LOAD_POSTS_FAILURE,
    LIKE_POST_REQUEST,
    UNLIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    UNLIKE_POST_SUCCESS,
    UNLIKE_POST_FAILURE,
    UPLOAD_IMAGES_REQUEST,
    UPLOAD_IMAGES_SUCCESS,
    UPLOAD_IMAGES_FAILURE,
    RETWEET_REQUEST,
    RETWEET_SUCCESS,
    RETWEET_FAILURE,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

function retweetAPI(data) {
    return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
    try {
        const result = yield call(retweetAPI, action.data);
        // yield delay(1000);
        console.log("retweet", result);
        yield put({
            type: RETWEET_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: RETWEET_FAILURE,
            error: err.response.data,
        });
    }
}

// form 데이터는 그대로 보내야한다 {}로 씌우면 안됨!
function uploadImagesAPI(data) {
    return axios.post(`/post/images`, data);
}

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data);
        // yield delay(1000);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: UPLOAD_IMAGES_FAILURE,
            error: err.response.data,
        });
    }
}

function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
    try {
        const result = yield call(likePostAPI, action.data);
        // yield delay(1000);
        yield put({
            type: LIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LIKE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function unlikePostAPI(data) {
    return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
    try {
        const result = yield call(unlikePostAPI, action.data);
        // yield delay(1000);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: UNLIKE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function addPostAPI(data) {
    return axios.post("/post", data);
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        // yield delay(1000);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: ADD_POST_TO_ME,
            data: result.data.id,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: ADD_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function loadPostsAPI(data) {
    return axios.get("/posts", data);
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsAPI, action.data);
        // yield delay(1000);
        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOAD_POSTS_FAILURE,
            error: err.response.data,
        });
    }
}

function removeAPI(data) {
    return axios.delete(`/post/${data}`);
}

function* removePost(action) {
    try {
        const result = yield call(removeAPI, action.data);
        // yield delay(1000);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: REMOVE_POST_FAILURE,
            error: err.response.data,
        });
    }
}
function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);
        // yield delay(1000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: ADD_COMMENT_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchRetweet() {
    yield throttle(5000, RETWEET_REQUEST, retweet);
}

function* watchUploadImages() {
    yield throttle(5000, UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
    yield throttle(5000, LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
    yield throttle(5000, UNLIKE_POST_REQUEST, unlikePost);
}

function* watchAddPost() {
    yield throttle(5000, ADD_POST_REQUEST, addPost);
}

function* watchLoadPosts() {
    yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
    yield all([
        fork(watchRetweet),
        fork(watchUploadImages),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchAddPost),
        fork(watchLoadPosts),
        fork(watchRemovePost),
        fork(watchAddComment),
    ]);
}
