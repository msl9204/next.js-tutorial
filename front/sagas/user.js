import { all, fork, takeLatest, put, call } from "redux-saga/effects";
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
    FOLLOW_REQUEST,
    UNFOLLOW_REQUEST,
    FOLLOW_SUCCESS,
    FOLLOW_FAILURE,
    UNFOLLOW_SUCCESS,
    UNFOLLOW_FAILURE,
    LOAD_MY_INFO_REQUEST,
    LOAD_MY_INFO_SUCCESS,
    LOAD_MY_INFO_FAILURE,
    CHANGE_NICKNAME_REQUEST,
    CHANGE_NICKNAME_SUCCESS,
    CHANGE_NICKNAME_FAILURE,
    LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWINGS_REQUEST,
    LOAD_FOLLOWERS_SUCCESS,
    LOAD_FOLLOWERS_FAILURE,
    LOAD_FOLLOWINGS_SUCCESS,
    LOAD_FOLLOWINGS_FAILURE,
    REMOVE_FOLLOWER_REQUEST,
    REMOVE_FOLLOWER_SUCCESS,
    REMOVE_FOLLOWER_FAILURE,
} from "../reducers/user";
import axios from "axios";

function removeFollowerAPI(data) {
    return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
    try {
        const result = yield call(removeFollowerAPI, action.data);
        // yield delay(1000);
        console.log("ers", result);
        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: REMOVE_FOLLOWER_FAILURE,
            error: err.response.data,
        });
    }
}

function loadFollowersAPI(data) {
    return axios.get(`/user/followers`, data);
}

function* loadFollowers(action) {
    try {
        const result = yield call(loadFollowersAPI, action.data);
        // yield delay(1000);
        console.log("ers", result);
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOAD_FOLLOWERS_FAILURE,
            error: err.response.data,
        });
    }
}

function loadFollowingsAPI(data) {
    return axios.get(`/user/followings`, data);
}

function* loadFollowings(action) {
    try {
        const result = yield call(loadFollowingsAPI, action.data);
        // yield delay(1000);
        console.log("ings", result);
        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOAD_FOLLOWINGS_FAILURE,
            error: err.response.data,
        });
    }
}

function followAPI(data) {
    return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
    try {
        const result = yield call(followAPI, action.data);
        // yield delay(1000);
        yield put({
            type: FOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: FOLLOW_FAILURE,
            error: err.response.data,
        });
    }
}

function unfollowAPI(data) {
    return axios.delete(`/user/${data}/follow`);
}

function* unfollow(action) {
    try {
        const result = yield call(unfollowAPI, action.data);
        // yield delay(1000);
        yield put({
            type: UNFOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: UNFOLLOW_FAILURE,
            error: err.response.data,
        });
    }
}

function changeNicknameAPI(data) {
    return axios.patch("/user/nickname", { nickname: data });
}

function* changeNickname(action) {
    try {
        const result = yield call(changeNicknameAPI, action.data);
        // yield delay(1000); // 서버가 없을 땐 delay로 비동기적인 효과를 만들어준다.
        yield put({
            type: CHANGE_NICKNAME_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: CHANGE_NICKNAME_FAILURE,
            error: err.response.data,
        });
    }
}

function loadUserAPI() {
    return axios.get("/user");
}

function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);
        // yield delay(1000); // 서버가 없을 땐 delay로 비동기적인 효과를 만들어준다.
        yield put({
            type: LOAD_MY_INFO_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOAD_MY_INFO_FAILURE,
            error: err.response.data,
        });
    }
}

function logInAPI(data) {
    return axios.post("/user/login", data);
}

function* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data);
        // yield delay(1000); // 서버가 없을 땐 delay로 비동기적인 효과를 만들어준다.
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
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
    return axios.post("/user/logout");
}

function* logOut() {
    try {
        yield call(logOutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        });
    }
}

function signUpAPI(data) {
    return axios.post("/user", data);
}

function* signUp(action) {
    try {
        const result = yield call(signUpAPI, action.data);
        console.log(result);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (err) {
        yield put({
            // put은 dispatch라고 보면 됨
            type: SIGN_UP_FAILURE,
            error: err.response.data, // backend의 body가 들어온다
        });
    }
}

function* watchRemoveFollwer() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLoadFollwers() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchChangeNickname() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadUser() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadUser);
}

function* watchFollow() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
    //while로 감싸줘야 무한하게 로그인 리퀘스트를 받을 수 있다.
    yield takeLatest(UNFOLLOW_REQUEST, unfollow);
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
    yield all([
        fork(watchRemoveFollwer),
        fork(watchLoadFollwers),
        fork(watchLoadFollowings),
        fork(watchChangeNickname),
        fork(watchLoadUser),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
    ]);
}
