import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import classes from './Header.module.css';
import Modal from '../../Modal/Modal';
import Login from '../../../Auth/Login/Login';
import Signup from '../../../Auth/Register/Register';
import Dropdown from '../Dropdown/Dropdown';
// import * as authActions from '../../../../store/actions/auth';

const Header = props => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const isLoggedIn = useSelector(state => state.auth.token !== null);

    // const dispatch = useDispatch();

    const modalCloseHandler = () => {
        setShowLogin(false);
        setShowSignup(false);
    }

    const dropdownToggler = () => {
        setDropdown(prev => !prev);
    }

    const dropdownCloseHandler = () => {
        setDropdown(false);
    }

    const loginHeader = (isLoggedIn
        ? <div style={{ marginRight: '50px', cursor: 'pointer' }}>
            <p onClick={dropdownToggler}>{localStorage.getItem('username')}</p>
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
        <div style={{ width: '100%', height: '100%' }}>
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
            </div>
            <div className={classes.Modal} style={{ position: 'absolute', right: '-100px' }}>
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
                <Dropdown showStyle={!dropdown ? { display: 'none' } : null} show={dropdown} modalClosed={dropdownCloseHandler}>
                    <NavLink onClick={() => setDropdown(false)} style={{ display: 'block' }} to='/my-page'>My page</NavLink>
                    <NavLink onClick={() => setDropdown(false)} style={{ display: 'block' }} to='/logout'>Log out</NavLink>
                </Dropdown>
            </div>
        </div>
    )
}

export default Header;
