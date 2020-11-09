import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as authActions from '../../../store/actions/auth';
import classes from './Login.module.css';

const Login = props => {

    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState();

    const dispatch = useDispatch();

    const inputChangeHandler = (identifier, event) => {
        if (identifier === 'email') {
            setEmailInput(event.target.value);
        } else if (identifier === 'password') {
            setPasswordInput(event.target.value);
        }
    }

    const submitHandler = async event => {
        event.preventDefault();
        try {
            await dispatch(authActions.login(emailInput, passwordInput));
            props.resetModal();
        } catch (err) {
            setError(err.message);
        }
    }

    const { show } = props;

    useEffect(() => {
        if (!show) {
            setPasswordInput('');
            setEmailInput('');
            setError(null);
        }
    }, [show]);

    return (
        <>
            <p>Login</p>
            <p>{error}</p>
            <form onSubmit={submitHandler}>
                <input className={classes.Input} type="email" placeholder="Email" value={emailInput} onChange={(event) => inputChangeHandler('email', event)} />
                <input className={classes.Input} type="password" placeholder="password" value={passwordInput} onChange={(event) => inputChangeHandler('password', event)} />
                <button className={classes.Button} onClick={props.authContinued}>Login</button>
            </form>
            <a href={"http://localhost:3001/user/auth/google"}>Login with Google</a>
            <a href={"http://localhost:3001/user/auth/facebook"}>Login with Facebook</a>
        </>
    )
}

export default Login;