import axios from "axios";
import {
    all,
    delay,
    fork,
    put,
    takeLatest,
    throttle,
} from "redux-saga/effects";
import shortId from "shortid";
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
    generateDummyPost,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

function addPostAPI(data) {
    return axios.post("/api/post", data);
}

function* addPost(action) {
    try {
        // const result = yield call(addPostAPI, action.data);
        yield delay(1000);
        const id = shortId.generate();
        yield put({
            type: ADD_POST_SUCCESS,
            data: {
                id,
                content: action.data,
            },
        });
        yield put({
            type: ADD_POST_TO_ME,
            data: id,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: ADD_POST_FAILURE,
            data: err.response.data,
        });
    }
}

function loadPostsAPI(data) {
    return axios.get("/api/post", data);
}

function* loadPosts(action) {
    try {
        // const result = yield call(loadPostsAPI, action.data);
        yield delay(1000);
        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: generateDummyPost(10),
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOAD_POSTS_FAILURE,
            data: err.response.data,
        });
    }
}

function removeAPI(data) {
    return axios.delete("/api/post", data);
}
function* removePost(action) {
    try {
        // const result = yield call(removeAPI, action.data);
        yield delay(1000);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: action.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: REMOVE_POST_FAILURE,
            data: err.response.data,
        });
    }
}
function addCommentAPI(data) {
    return axios.post(`/api/post/${data.postId}/comment`, data);
}

function* addComment(action) {
    try {
        // const result = yield call(addCommentAPI, action.data);
        yield delay(1000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: ADD_COMMENT_FAILURE,
            data: err.response.data,
        });
    }
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
        fork(watchAddPost),
        fork(watchLoadPosts),
        fork(watchRemovePost),
        fork(watchAddComment),
    ]);
}