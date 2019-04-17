import React, { useEffect } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";

import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

const Orders = props => {
	useEffect(() => {
		props.onGetOrders(props.token, props.userId);
	}, []);

	return (
		<div>
			{props.loading && <Spinner />}

			{props.orders.map(order => (
				<Order
					key={order.id}
					ingredients={order.ingredients}
					price={order.price}
				/>
			))}
		</div>
	);
};

const mapStateToProps = state => ({
	orders: state.order.orders,
	loading: state.order.loading,
	token: state.auth.token,
	userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
	onGetOrders: (token, userId) => dispatch(actions.getOrders(token, userId))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Orders, axios));
