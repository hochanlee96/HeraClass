import React from 'react';

import AuthForm from '../../components/Auth/AuthForm/AuthForm';

const Auth = props => {

    return (
        <>
            <AuthForm history={props.history} />
        </>
    )

}

export default Auth;