import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import { checkValidity } from "../../store/utils";

const Auth = props => {
	const [controls, setControls] = useState({
		email: {
			elementType: "input",
			elementConfig: {
				type: "email",
				placeholder: "Email Addres",
				label: "Email"
			},
			value: "", // Important for two-way data binding
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		password: {
			elementType: "input",
			elementConfig: {
				type: "password",
				placeholder: "Password",
				label: "Password"
			},
			value: "", // Important for two-way data binding
			validation: {
				required: true,
				minLength: 6 // 6 is min length required by firebase
			},
			valid: false,
			touched: false
		}
	});
	const [isSignUp, setIsSignUp] = useState(true);

	useEffect(() => {
		if (!props.isBuildingBurger && props.authRedirectPath !== "/") {
			props.onSetAuthRedirectPath();
		}
	}, []);

	const inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...controls,
			[controlName]: {
				...controls[controlName],
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					controls[controlName].validation
				),
				touched: true
			}
		};
		setControls(updatedControls);
	};

	const submitHandler = e => {
		e.preventDefault();
		const { email, password } = controls;
		props.onAuth(email.value, password.value, isSignUp);
	};

	const switchAuthModeHandler = () => {
		setIsSignUp(!isSignUp);
	};

	let formElementsArray = [];
	for (const key in controls) {
		formElementsArray.push({
			id: key,
			config: controls[key]
		});
	}
	// console.log(formElementsArray)

	let form = (
		<form onSubmit={submitHandler}>
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
			<Button btnType="Success">Submit</Button>
		</form>
	);

	let content = (
		<div className={classes.Auth}>
			{props.isAuthenticated && <Redirect to={props.authRedirectPath} />}
			{form}
			<Button btnType="Danger" clicked={switchAuthModeHandler}>
				Switch To {isSignUp ? "Sign In" : "Sign Up"}
			</Button>
		</div>
	);

	if (props.loading) {
		content = <Spinner />;
	}

	return content;
};

const mapStateToProps = state => ({
	loading: state.auth.loading,
	isAuthenticated: state.auth.token !== null,
	isBuildingBurger: state.burgerBuilder.building,
	authRedirectPath: state.auth.authRedirectPath
});

const mapDispatchToProps = dispatch => ({
	onAuth: (email, password, isSignUp) =>
		dispatch(actions.auth(email, password, isSignUp)),
	onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Auth);
