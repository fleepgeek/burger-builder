import { put } from "redux-saga/effects";
import { delay } from "redux-saga";

import * as actions from "../actions/index";
import axios from "axios";

export function* logoutSaga(action) {
    //yield before localStorage is not neccessary
    //because it is a synchronous code
    yield localStorage.removeItem('token')
    yield localStorage.removeItem('expirationDate')
    yield localStorage.removeItem('userId')
    yield put(actions.logoutSucceed())
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000)
    yield put(actions.logout())
}

export function* authSaga(action) {
    yield put(actions.authStart())
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true,
    }
    const apiKey = process.env.REACT_APP_FIREBASE_KEY

    let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`
    if (!action.isSignUp) {
        url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`
    }

    try {
        const response = yield axios.post(url, authData)
        const { idToken, localId, expiresIn } = response.data;
        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        localStorage.setItem('token', idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', localId);
        yield put(actions.authSuccess(idToken, localId));
        yield put(actions.checkAuthTimeout(expiresIn));
    } catch (error) {
        put(actions.authFail(error))
    }
}

export function* authCheckStateSaga(action) {
    const token = localStorage.getItem('token')
    if (!token) {
        yield put(actions.logout())
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'))
        const userId = localStorage.getItem('userId')
        if (expirationDate > new Date()) {
            yield put(actions.authSuccess(token, userId))
            yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
        } else {
            yield put(actions.logout())
        }
    }
}