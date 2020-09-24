import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as authActions from '../../../store/actions/auth';

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
            props.history.push(props.returnScreen);
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
        <div>
            <p>Login</p>
            <p>{error}</p>
            <form onSubmit={submitHandler}>
                <input type="email" value={emailInput} onChange={(event) => inputChangeHandler('email', event)} />
                <input type="password" value={passwordInput} onChange={(event) => inputChangeHandler('password', event)} />
                <button onClick={props.authContinued}>Login</button>
            </form>
        </div>
    )
}

export default Login;