import * as actionTypes from './actionTypes';

export const addIngredient = (ingredientName) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName,
    }
}

export const removeIngredient = (ingredientName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName,
    }
}

export const setIngredients = (ingredients) => (
    {
        type: actionTypes.SET_INGREDIENTS,
        ingredients,
    }
)

export const fetchIngredientsFailed = () => (
    {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
)

export const initIngredients = () => (
    {
        type: actionTypes.INIT_INGREDIENTS
    }
)
