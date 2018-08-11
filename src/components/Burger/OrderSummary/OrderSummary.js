import React, { Fragment} from 'react';

import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => (
                <li key={igKey}>
                    <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}
                </li>
            ) 
        );

    return (
        <Fragment>
            <h3>Your Order</h3>
            <p>Your Burger has the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><b>Total Price: {props.price.toFixed(2)}</b></p>
            <p>Continue to Checkout?</p>
            <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
        </Fragment>
    )
};

export default OrderSummary;