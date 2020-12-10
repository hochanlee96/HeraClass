import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as authActions from '../../../store/actions/auth';

const Logout = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authActions.logout());
    }, [dispatch]);

    return <Redirect to='/home' />;
}


export default Logout;