import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import { checkValidity } from '../../store/utils';


class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email Addres',
                    label: 'Email',
                },
                value: '', // Important for two-way data binding
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                    label: 'Password',
                },
                value: '', // Important for two-way data binding
                validation: {
                    required: true,
                    minLength: 6, // 6 is min length required by firebase
                },
                valid: false,
                touched: false,
            },
        },
        isSignUp: true,
    }

    componentDidMount() {
        if(!this.props.isBuildingBurger && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true,
            }
        }

        this.setState({ controls: updatedControls, })
    }

    submitHandler = (e) => {
        e.preventDefault();
        const { email, password } = this.state.controls
        this.props.onAuth(email.value, password.value, this.state.isSignUp);
    }

    switchAuthModeHandler = () => {
        this.setState((prevState) => ({
            isSignUp: !prevState.isSignUp
        }))
    }

    render() {
        let formElementsArray = []
        for (const key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }
        // console.log(formElementsArray)

        let form = (
            <form onSubmit={this.submitHandler}>
                {formElementsArray.map(formElement => (
                    <Input key={formElement.id} elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        touched={formElement.config.touched}
                        shouldValidate={formElement.config.validation}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success">Submit</Button>
            </form>
        )

        let content = (
            <div className={classes.Auth}>
                {this.props.isAuthenticated && <Redirect to={this.props.authRedirectPath} />}
                {form}
                <Button
                    btnType="Danger"
                    clicked={this.switchAuthModeHandler}>
                    Switch To {this.state.isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
            </div>
        )

        if (this.props.loading) {
            content = <Spinner />
        }

        return content;
    }
}

const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    isAuthenticated: state.auth.token !== null,
    isBuildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
})

const mapDispatchToProps = (dispatch) => ({
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth);