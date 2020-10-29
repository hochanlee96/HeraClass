import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import * as authActions from '../../../store/actions/auth';
import classes from './AuthForm.module.css';

const AuthForm = props => {
    const [emailInput, setEmailInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState();
    const { isSignin, history } = props;
    const dispatch = useDispatch();

    const inputChangeHandler = (identifier, event) => {
        if (identifier === 'email') {
            setEmailInput(event.target.value);
        } else if (identifier === 'username') {
            setUsernameInput(event.target.value);
        } else if (identifier === 'password') {
            setPasswordInput(event.target.value);
        }
    }

    const submitHandler = async event => {
        event.preventDefault();
        try {
            if (isSignin) {
                await dispatch(authActions.login(emailInput, passwordInput));
            } else {
                await dispatch(authActions.register(emailInput, passwordInput));
            }
            setUsernameInput('');
            setEmailInput('');
            setPasswordInput('');
            history.goBack();

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <p>{isSignin ? 'Log In' : 'Sign Up'}</p>
            <p>{error}</p>
            <form onSubmit={submitHandler}>
                <input className={classes.Input} type="email" placeholder="Email" value={emailInput} onChange={(event) => inputChangeHandler('email', event)} />
                {!isSignin && <input className={classes.Input} type="text" placeholder="Username" value={usernameInput} onChange={(event) => inputChangeHandler('username', event)} />}
                <input className={classes.Input} type="password" placeholder="password" value={passwordInput} onChange={(event) => inputChangeHandler('password', event)} />
                <button className={classes.Button} onClick={submitHandler}>{isSignin ? 'Log In' : 'Register'}</button>
            </form>
        </>
    )
}

export default AuthForm;