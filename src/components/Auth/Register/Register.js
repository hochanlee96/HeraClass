import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import * as authActions from '../../../store/actions/auth';

const Register = props => {

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
            await dispatch(authActions.register(emailInput, passwordInput));
            props.resetModal();
            props.history.push(props.returnScreen);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <p>Sign Up</p>
            <p>{error}</p>
            <form onSubmit={submitHandler}>
                <input type="email" value={emailInput} onChange={(event) => inputChangeHandler('email', event)} />
                <input type="password" value={passwordInput} onChange={(event) => inputChangeHandler('password', event)} />
                <button onClick={props.authContinued}>Sign Up</button>
            </form>
        </div>
    )
}

export default Register;