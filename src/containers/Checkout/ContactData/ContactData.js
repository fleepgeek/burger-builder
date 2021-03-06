import React, { useState } from "react";
import { connect } from "react-redux";

import * as actions from "../../../store/actions/index";

import classes from "./ContactData.css";
import Button from "../../../components/UI/Button/Button";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { checkValidity } from "../../../store/utils";

const ContactData = props => {
	const [orderForm, setOrderForm] = useState({
		name: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Your Name",
				label: "Name"
			},
			value: "", // Important for two-way data binding
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		street: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Your Street",
				label: "Your Street"
			},
			value: "",
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		zipCode: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Zip Code",
				label: "Your Zip Code"
			},
			value: "",
			validation: {
				required: true,
				minLength: 5,
				maxLength: 5
			},
			valid: false,
			touched: false
		},
		country: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Country",
				label: "Your Country"
			},
			value: "",
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		email: {
			elementType: "input",
			elementConfig: {
				type: "email",
				placeholder: "Your Email",
				label: "Email"
			},
			value: "",
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		deliveryMethod: {
			elementType: "select",
			elementConfig: {
				options: [
					{ value: "fastest", displayValue: "Fastest" },
					{ value: "cheapest", displayValue: "Cheapest" }
				],
				label: "Delivery Method"
			},
			value: "fastest",
			validation: {},
			valid: true
		}
	});
	const [formIsValid, setFormIsValid] = useState(false);

	const orderHandler = e => {
		e.preventDefault();
		//In a real proj, make sure to calc the total price on the server-side
		// setState({ loading: true });
		const formData = {};
		for (const formElementIndentifier in orderForm) {
			formData[formElementIndentifier] =
				orderForm[formElementIndentifier].value;
		}
		const order = {
			ingredients: props.ingredients,
			price: props.price,
			orderData: formData,
			userId: props.userId
		};
		props.onOrderBurger(order, props.token);
	};

	const inputChangedHandler = (event, inputIndentifier) => {
		const updatedOrderForm = { ...orderForm };
		const updatedFormElement = { ...updatedOrderForm[inputIndentifier] };
		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = checkValidity(
			updatedFormElement.value,
			updatedFormElement.validation
		);
		updatedFormElement.touched = true;
		// console.log(updatedFormElement);
		updatedOrderForm[inputIndentifier] = updatedFormElement;

		let formIsValid = true;
		for (let inputIndentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIndentifier].valid && formIsValid;
		}
		// console.log(formIsValid)
		setOrderForm(updatedOrderForm);
		setFormIsValid(formIsValid);
	};

	let formElementsArray = [];
	for (const key in orderForm) {
		formElementsArray.push({
			id: key,
			config: orderForm[key]
		});
	}
	// console.log(formElementsArray)

	let form = (
		<form onSubmit={orderHandler}>
			{formElementsArray.map(formElement => (
				<Input
					key={formElement.id}
					elementType={formElement.config.elementType}
					elementConfig={formElement.config.elementConfig}
					value={formElement.config.value}
					invalid={!formElement.config.valid}
					touched={formElement.config.touched}
					shouldValidate={formElement.config.validation}
					changed={event => inputChangedHandler(event, formElement.id)}
				/>
			))}
			<Button btnType="Success" disabled={!formIsValid}>
				ORDER
			</Button>
		</form>
	);

	if (props.loading) {
		form = <Spinner />;
	}

	return (
		<div className={classes.ContactData}>
			<h4>Enter your Contact Data</h4>
			{form}
		</div>
	);
};

const mapStateToProps = state => ({
	ingredients: state.burgerBuilder.ingredients,
	price: state.burgerBuilder.totalPrice,
	loading: state.order.loading,
	token: state.auth.token,
	userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
	onOrderBurger: (orderData, token) =>
		dispatch(actions.purchaseBurger(orderData, token))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios));
