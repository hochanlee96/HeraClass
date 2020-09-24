import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import classes from './Header.module.css';
import Modal from '../../Modal/Modal';
import Login from '../../../Auth/Login/Login';
import Signup from '../../../Auth/Register/Register';
import * as authActions from '../../../../store/actions/auth';

const Header = props => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const isLoggedIn = useSelector(state => state.auth.token !== null);

    const dispatch = useDispatch();

    const modalCloseHandler = () => {
        setShowLogin(false);
        setShowSignup(false);
    }

    const loginHeader = (isLoggedIn
        ? <div className={classes.Item}>
            <button
                onClick={() => {
                    dispatch(authActions.logout());
                }}>
                Log Out
                    </button>
        </div>
        : <div className={classes.Item}>
            <button
                onClick={() => {
                    setShowLogin(true);
                }}>
                Login
                        </button>
            <button
                onClick={() => {
                    setShowSignup(true);
                }}>
                Sign Up
                        </button>
        </div>)

    return (
        <div className={classes.Header}>
            <div className={classes.Item}>Logo</div>
            <div className={classes.Item}>
                <NavLink
                    className={classes.Link}
                    to='/class-list'
                    exact
                >View Class List</NavLink>
                <NavLink
                    className={classes.Link}
                    to='/home'
                    exact >
                    Home
                </NavLink>
            </div>
            {loginHeader}
            <div className={classes.Modal}>
                <Modal show={showLogin} modalClosed={modalCloseHandler}>
                    <Login
                        history={props.history}
                        resetModal={() => setShowLogin(false)}
                        show={showLogin} />
                </Modal>
                <Modal show={showSignup} modalClosed={modalCloseHandler}>
                    <Signup
                        history={props.history}
                        resetModal={() => setShowSignup(false)}
                        show={showSignup} />
                </Modal>
            </div>
        </div>
    )
}

export default Header;
