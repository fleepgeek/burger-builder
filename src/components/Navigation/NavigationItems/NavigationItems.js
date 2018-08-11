import React from 'react';

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'

const NavigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/">Burger Builder</NavigationItem>
        {props.isAuthenticated && <NavigationItem link="/orders">Orders</NavigationItem>}
        {props.isAuthenticated
            ? <NavigationItem link="/logout">Logout</NavigationItem>
            : <NavigationItem link="/auth">Authenticate</NavigationItem>
        }
    </ul>
);

export default NavigationItems;