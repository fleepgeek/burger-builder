import { takeEvery, takeLatest, all } from 'redux-saga/effects'
import { logoutSaga, checkAuthTimeoutSaga, authSaga, authCheckStateSaga } from './auth'

import * as actionTypes from '../actions/actionTypes'
import { initIngredientsSaga } from './burgerBuilder';
import { getOrdersSaga, purchaseBurgerSaga } from './order';

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
        takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
        takeEvery(actionTypes.AUTH_USER, authSaga),
        takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
    ])
}

export function* watchBurgerBuilder() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga)
}

export function* watchOrder() {
    yield takeEvery(actionTypes.GET_ORDERS, getOrdersSaga)
    yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga)
}

