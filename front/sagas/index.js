import { all, fork, call, put, take } from "redux-saga/effects";
import axios from "axios";

function logInAPI() {
    return axios.post("/api/login");
}

function* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data);
        yield put({
            type: "LOG_IN_SUCCESS",
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: "LOG_IN_FAILURE",
            data: err.response.data,
        });
    }
}

function logOutAPI() {
    return axios.post("/api/post");
}

function* logOut() {
    try {
        const result = yield call(logOutAPI);
        yield put({
            type: "LOG_OUT_SUCCESS",
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: "LOG_OUT_FAILURE",
            data: err.response.data,
        });
    }
}

function addPostAPI(data) {
    return axios.post("/api/post", data);
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: "ADD_POST_SUCCESS",
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: "ADD_POST_FAILURE",
            data: err.response.data,
        });
    }
}

function* watchLogIn() {
    yield take("LOG_IN_REQUEST", logIn);
}

function* watchLogOut() {
    yield take("LOG_OUT_REQUEST", logOut);
}

function* watchAddPost() {
    yield take("ADD_POST_REQUEST", addPost);
}

export default function* rootSaga() {
    yield all([fork(watchLogIn), fork(watchLogOut), fork(watchAddPost)]);
}
