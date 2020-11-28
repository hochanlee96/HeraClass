import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as authActions from '../../../store/actions/auth';
import classes from './AuthForm.module.css';

const AuthForm = () => {
    const [emailInput, setEmailInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [isSignin, setIsSignin] = useState(true);
    const [error, setError] = useState();
    const redirect_path = useSelector(state => state.auth.redirect);
    const dispatch = useDispatch();
    const history = useHistory();

    const inputChangeHandler = (identifier, event) => {
        if (identifier === 'email') {
            setEmailInput(event.target.value);
        } else if (identifier === 'username') {
            setUsernameInput(event.target.value);
        } else if (identifier === 'password') {
            setPasswordInput(event.target.value);
        }
    }

    const authToggler = () => {
        setIsSignin(prev => !prev)
    }

    const submitHandler = event => {
        event.preventDefault();
        try {
            if (isSignin) {
                dispatch(authActions.login(emailInput, passwordInput));
            } else {
                dispatch(authActions.register(emailInput, usernameInput, passwordInput));
            }
            history.push(redirect_path)
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
            <button onClick={authToggler}>Switch to {isSignin ? "Sign Up" : "Log In"}</button>
            {isSignin ? <> <a href={"http://localhost:3001/user/auth/google"}>Login with Google</a> <a href={"http://localhost:3001/user/auth/facebook"}>Login with Facebook</a></> : null}
        </>
    )
}

export default AuthForm;