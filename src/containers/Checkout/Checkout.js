import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';


class Checkout extends Component {
    
    checkoutCanceledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        let summary = <Redirect to="/" />
        if (this.props.ingredients && !this.props.purchased) {
            summary = (
                <div>
                    <CheckoutSummary
                        ingredients={this.props.ingredients}
                        checkoutCanceled={this.checkoutCanceledHandler}
                        checkoutContinued={this.checkoutContinuedHandler} />

                    <Route
                        path={`${this.props.match.path}/contact-data`}
                        component={ContactData} />
                </div>
            )
        }
        return summary;
    }
}

const mapStateToProps = (state) => ({
    ingredients: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
})


export default connect(mapStateToProps)(Checkout);