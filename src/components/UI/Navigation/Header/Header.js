import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import classes from './Header.module.css';
import Modal from '../../Modal/Modal';
import Login from '../../../Auth/Login/Login';
import Signup from '../../../Auth/Register/Register';

const Header = props => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const isLoggedIn = useSelector(state => state.auth.token !== null);

    const modalCloseHandler = () => {
        setShowLogin(false);
        setShowSignup(false);
    }

    const authContinueHandler = () => {

    }

    const loginHeader = (isLoggedIn
        ? <p>Log Out</p>
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
                    <Login />
                </Modal>
                <Modal show={showSignup} modalClosed={modalCloseHandler}>
                    <Signup history={props.history} authContinued={authContinueHandler}
                        resetModal={() => setShowSignup(false)}
                        returnScreen={props.currentScreen} />
                </Modal>
            </div>
        </div>
    )
}

export default Header;
