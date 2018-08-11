import * as actionTypes from '../actions/actionTypes';
// import updateObject from '../utils';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false,
}

const INGREDIENTS_PRICES = {
    cheese: 0.5,
    bacon: 0.4,
    salad: 1.3,
    meat: 0.7,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1,
                },
                totalPrice: state.totalPrice + INGREDIENTS_PRICES[action.ingredientName],
                building: true,
            }
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1,
                },
                totalPrice: state.totalPrice - INGREDIENTS_PRICES[action.ingredientName],
                building: true,
            }
        case actionTypes.SET_INGREDIENTS:
            return {
                ...state,
                ingredients: action.ingredients,
                error: false,
                totalPrice: 4,
                building: false,
            }
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return {
                ...state,
                error: true,
            }
        default:
            return state;
    }
}

export default reducer;