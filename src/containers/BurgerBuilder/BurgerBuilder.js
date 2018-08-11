import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
// import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';


export class BurgerBuilder extends Component {
    //the constructor is implicitly called when Babel transpiles the code
    //so no need to declare this in a constructor
    purchaseHandler = this.purchaseHandler.bind(this);

    state = {
        purchasing: false,
    }

    componentDidMount() {
        this.props.onInitIngrdients();
    }

    updatePurchasable(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => (ingredients[igKey]))
            .reduce((prevSum, curSum) => (prevSum + curSum), 0);

        return  sum > 0
    }

    //Alternative way instead of arrow functions. Remember to call bind()
    purchaseHandler() {
        if(this.props.isAuthenticated){
            this.setState({ purchasing: true })
        }else {
            this.props.setAuthRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        this.props.onPurchaseInit();
        this.props.history.push('/checkout');
    }

    render() {
        let disabledInfo = { ...this.props.ingredients }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        let orderSummary = null;

        if (this.props.ingredients) {
            burger = (
                <Fragment>
                    <Burger ingredients={this.props.ingredients} />
                    <BuildControls
                        ingredientAdded={this.props.onAddIngrdient}
                        ingredientRemoved={this.props.onRemoveIngrdient}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchasable(this.props.ingredients)}
                        price={this.props.totalPrice}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated} />
                </Fragment>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ingredients}
                price={this.props.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />
        }

        return (
            <Fragment>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
})

const mapDispatchToProps = (dispatch) => ({
    onAddIngrdient: (ingName) => dispatch(actions.addIngredient(ingName)),
    onRemoveIngrdient: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngrdients: () => dispatch(actions.initIngredients()),
    // onAddIngrdient: (name) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: name }),
    // onRemoveIngrdient: (name) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: name }),
    onPurchaseInit: () => dispatch(actions.purchaseInit()),
    setAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
})


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));