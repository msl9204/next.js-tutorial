import { all, fork, takeLatest, put, delay, call } from "redux-saga/effects";
import {
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS,
    LOG_OUT_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
} from "../reducers/user";
import axios from "axios";

// function logInAPI() {
//     return axios.post("/api/login");
// }

function* logIn(action) {
    try {
        console.log("sage");
        // const result = yield call(logInAPI, action.data);
        yield delay(1000); // 서버가 없을 땐 delay로 비동기적인 효과를 만들어준다.
        yield put({
            type: LOG_IN_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOG_IN_FAILURE,
            error: err.response.data,
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
            type: LOG_OUT_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        });
    }
}

function signUpAPI() {
    return axios.post("/api/post");
}

function* signUp() {
    try {
        // const result = yield call(signUpAPI);
        yield delay(1000);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: SIGN_UP_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLogIn() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
    // 다른방법으로는 takeEvery로 하면 무한정 받는다.
    // 단, while take는 동기적으로, takeEvery는 비동기적으로 동작
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
    // 다른방법으로는 takeEvery로 하면 무한정 받는다.
    // 단, while take는 동기적으로, takeEvery는 비동기적으로 동작
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp)]);
}