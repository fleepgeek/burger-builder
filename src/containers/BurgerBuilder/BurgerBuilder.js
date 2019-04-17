import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";

import axios from "../../axios-orders";
// import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from "../../store/actions/index";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

const BurgerBuilder = props => {
	const [purchasing, setPurchasing] = useState(false);

	useEffect(() => {
		props.onInitIngrdients();
	}, []);

	const updatePurchasable = ingredients => {
		const sum = Object.keys(ingredients)
			.map(igKey => ingredients[igKey])
			.reduce((prevSum, curSum) => prevSum + curSum, 0);

		return sum > 0;
	};

	const purchaseHandler = () => {
		if (props.isAuthenticated) {
			setPurchasing(true);
		} else {
			props.setAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};

	const purchaseContinueHandler = () => {
		props.onPurchaseInit();
		props.history.push("/checkout");
	};

	let disabledInfo = { ...props.ingredients };
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let burger = props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
	let orderSummary = null;

	if (props.ingredients) {
		burger = (
			<Fragment>
				<Burger ingredients={props.ingredients} />
				<BuildControls
					ingredientAdded={props.onAddIngrdient}
					ingredientRemoved={props.onRemoveIngrdient}
					disabled={disabledInfo}
					purchasable={updatePurchasable(props.ingredients)}
					price={props.totalPrice}
					ordered={purchaseHandler}
					isAuth={props.isAuthenticated}
				/>
			</Fragment>
		);
		orderSummary = (
			<OrderSummary
				ingredients={props.ingredients}
				price={props.totalPrice}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
			/>
		);
	}

	return (
		<Fragment>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Fragment>
	);
};

const mapStateToProps = state => ({
	ingredients: state.burgerBuilder.ingredients,
	totalPrice: state.burgerBuilder.totalPrice,
	error: state.burgerBuilder.error,
	isAuthenticated: state.auth.token !== null
});

const mapDispatchToProps = dispatch => ({
	onAddIngrdient: ingName => dispatch(actions.addIngredient(ingName)),
	// onAddIngrdient: (name) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: name }),
	onRemoveIngrdient: ingName => dispatch(actions.removeIngredient(ingName)),
	onInitIngrdients: () => dispatch(actions.initIngredients()),
	onPurchaseInit: () => dispatch(actions.purchaseInit()),
	setAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
