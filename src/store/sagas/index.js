import { takeEvery } from 'redux-saga/effects'
import { logoutSaga, checkAuthTimeoutSaga, authSaga, authCheckStateSaga } from './auth'

import * as actionTypes from '../actions/actionTypes'

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga)
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga)
    yield takeEvery(actionTypes.AUTH_USER, authSaga)
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
}