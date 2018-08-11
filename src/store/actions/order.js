import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';


export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT,
    }
}

const purchaseBurgerStart = () => (
    {
        type: actionTypes.PURCHASE_BURGER_START,
    }
)

const purchaseBurgerFail = (error) => (
    {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error,
    }
)

const purchaseBurgerSuccess = (orderId, orderData) => (
    {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId,
        orderData,
    }
)

export const purchaseBurger = (orderData, token) => (
    (dispatch) => {
        dispatch(purchaseBurgerStart());
        axios.post(`/orders.json?auth=${token}`, orderData)
            .then(response => {
                //console.log(response.data)
                dispatch(purchaseBurgerSuccess(response.data.name, orderData))
            })
            .catch(error => {
                dispatch(purchaseBurgerFail(error))
            });
    }
)

const fetchOrdersStart = () => ({
    type: actionTypes.FETCH_ORDERS_START,
})

const fetchOrdersFail = (error) => ({
    type: actionTypes.FETCH_ORDERS_FAIL,
    error,
})

const fetchOrdersSuccess = (orders) => ({
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders,
})

export const getOrders = (token, userId) => (
    (dispatch) => {
        dispatch(fetchOrdersStart());
        // equalTo returns the value of the key which is the 
        // value of orderBy ie userid
        const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`
        axios.get(`/orders.json${queryParams}`)
            .then(res => {
                const fetchedOrders = [];
                for (const key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key,
                    })
                }
                dispatch(fetchOrdersSuccess(fetchedOrders))
            })
            .catch(error => {
                dispatch(fetchOrdersFail(error))
            });
    }
)