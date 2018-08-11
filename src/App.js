import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import * as actions from './store/actions/index';

import Layout from './containers/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
// import Checkout from './containers/Checkout/Checkout';
// import Orders from './containers/Orders/Orders';
// import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

const AsyncAuth = asyncComponent(() => (
  import('./containers/Auth/Auth')
));
const AsyncCheckout = asyncComponent(() => (
  import('./containers/Checkout/Checkout')
));
const AsyncOrders = asyncComponent(() => (
  import('./containers/Orders/Orders')
));


class App extends Component {

  componentDidMount() {
    this.props.tryAutoSignIn()
  }

  render() {
    let routes = (
      <Switch>
        <Route path='/auth' component={AsyncAuth} />
        <Route path='/' exact component={BurgerBuilder} />
        <Route render={() => <h2>Not Found</h2>} />
      </Switch>
    )

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/checkout' component={AsyncCheckout} />
          <Route path='/orders' component={AsyncOrders} />
          <Route path='/auth' component={AsyncAuth} />
          <Route path='/logout' component={Logout} />
          <Route path='/' exact component={BurgerBuilder} />
          <Route render={() => <h2>Not Found</h2>} />
        </Switch>
      )
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token !== null,
})

const mapDispatchToProps = (dispatch) => ({
  tryAutoSignIn: () => dispatch(actions.authCheckState())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
