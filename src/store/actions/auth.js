import * as actionTypes from './actionTypes';

export const authStart = () => (
    {
        type: actionTypes.AUTH_START,
    }
)

export const authSuccess = (idToken, userId) => (
    {
        type: actionTypes.AUTH_SUCCESS,
        idToken,
        userId,
    }
)

export const authFail = (error) => (
    {
        type: actionTypes.AUTH_FAIL,
        error,
    }
)

export const logout = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT,
    }
}

export const logoutSucceed = () => (
    {
        type: actionTypes.AUTH_LOGOUT,
    }
)

export const checkAuthTimeout = (expirationTime) => (
    {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTime
    }
)

export const auth = (email, password, isSignUp) => (
    {
        type: actionTypes.AUTH_USER,
        email,
        password,
        isSignUp
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
    {
        type: actionTypes.AUTH_CHECK_STATE
    }
)