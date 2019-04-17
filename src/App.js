import React, { useEffect, Suspense } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "./store/actions/index";

import Layout from "./containers/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Logout from "./containers/Auth/Logout/Logout";

const Auth = React.lazy(() => import("./containers/Auth/Auth"));
const Checkout = React.lazy(() => import("./containers/Checkout/Checkout"));
const Orders = React.lazy(() => import("./containers/Orders/Orders"));

const App = props => {
	useEffect(() => {
		props.tryAutoSignIn();
	}, []);

	let routes = (
		<Switch>
			<Route path="/auth" render={props => <Auth {...props} />} />
			<Route path="/" exact component={BurgerBuilder} />
			<Route render={() => <h2>Not Found</h2>} />
		</Switch>
	);

	if (props.isAuthenticated) {
		routes = (
			<Switch>
				<Route path="/checkout" render={props => <Checkout {...props} />} />
				<Route path="/orders" render={props => <Orders {...props} />} />
				<Route path="/auth" render={props => <Auth {...props} />} />
				<Route path="/logout" component={Logout} />
				<Route path="/" exact component={BurgerBuilder} />
				<Route render={() => <h2>Not Found</h2>} />
			</Switch>
		);
	}

	return (
		<div>
			<Layout>
				<Suspense fallback={<p>...Loading</p>}>{routes}</Suspense>
			</Layout>
		</div>
	);
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.token !== null
});

const mapDispatchToProps = dispatch => ({
	tryAutoSignIn: () => dispatch(actions.authCheckState())
});

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(App)
);
