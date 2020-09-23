import React, { useState } from 'react';

const Login = props => {

    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const inputChangeHandler = (identifier, event) => {
        if (identifier === 'email') {
            setEmailInput(event.target.value);
        } else if (identifier === 'password') {
            setPasswordInput(event.target.value);
        }
    }

    const submitHandler = event => {
        event.preventDefault();
        // dispatch(authActions.login(emailInput, passwordInput));
    }

    return (
        <div>
            <p>Login</p>
            <form onSubmit={submitHandler}>
                <input type="email" value={emailInput} onChange={(event) => inputChangeHandler('email', event)} />
                <input type="password" value={passwordInput} onChange={(event) => inputChangeHandler('password', event)} />
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login;