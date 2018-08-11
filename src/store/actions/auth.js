import axios from 'axios';

import * as actionTypes from './actionTypes';

const authStart = () => (
    {
        type: actionTypes.AUTH_START,
    }
)

const authSuccess = (idToken, userId) => (
    {
        type: actionTypes.AUTH_SUCCESS,
        idToken,
        userId,
    }
)

const authFail = (error) => (
    {
        type: actionTypes.AUTH_FAIL,
        error,
    }
)

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const checkAuthTimeout = (expirationTime) => (
    (dispatch) => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000);
    }
)

export const auth = (email, password, isSignUp) => (
    (dispatch) => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true,
        }
        const apiKey = process.env.REACT_APP_FIREBASE_KEY
        
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`
        if (!isSignUp) {
            url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`
        }
        
        axios.post(url, authData)
            .then(response => {
                //console.log(response);
                const { idToken, localId, expiresIn } = response.data;
                const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
                localStorage.setItem('token', idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', localId);
                dispatch(authSuccess(idToken, localId));
                dispatch(checkAuthTimeout(expiresIn));
            })
            .catch(error => {
                //console.log(error)
                dispatch(authFail(error))
            })
    }
)

export const setAuthRedirectPath = (path) => (
    {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path,
    }
)

// Just a utility action to check user credentials
// on startup to know if to log user in or out
export const authCheckState = () => (
    (dispatch) => {
        const token = localStorage.getItem('token')
        if(!token) {
            dispatch(logout())
        }else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            const userId = localStorage.getItem('userId')
            if(expirationDate > new Date()){
                dispatch(authSuccess(token, userId))
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
            }else {
                dispatch(logout())
            }
        }
    }
)