import React, { useState } from 'react';

import AuthForm from '../../components/Auth/AuthForm/AuthForm';

const Auth = props => {
    const [isSignin, setIsSignin] = useState(true);

    const authToggler = () => {
        setIsSignin(prev => !prev);
    }

    return (
        <>
            <AuthForm isSignin={isSignin} history={props.history} />
            <button onClick={authToggler}>Switch to {isSignin ? "Sign Up" : "Log In"}</button>
        </>
    )

}

export default Auth;