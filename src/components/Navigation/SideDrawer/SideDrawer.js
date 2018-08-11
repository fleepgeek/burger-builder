import React, {Fragment} from 'react';

import classes from './SideDrawer.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';

const SideDrawer = (props) => {
    const attachedClasses = props.show ? classes.Open : classes.Close;
    return (
        <Fragment>
            <Backdrop show={props.show} clicked={props.closed} />
            <div className={[classes.SideDrawer, attachedClasses].join(' ')} onClick={props.closed}>
                <div className={classes.Logo}>
                    <Logo />  
                </div>
                <nav>
                    <NavigationItems isAuthenticated={props.isAuth} />
                </nav>
            </div>
        </Fragment>
    );
};

export default SideDrawer;