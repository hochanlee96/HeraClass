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
    const username = useSelector(state => state.auth.userData.username);

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
            <p onClick={dropdownToggler}>{username}</p>
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
        <>
            <nav className={classes.Header}>
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
            </nav>
            <div className={classes.Modal} style={{ position: 'absolute', right: '-100px' }}>
                <Modal show={showLogin} modalClosed={modalCloseHandler}>
                    <Login
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
                    <NavLink className={classes.Nav} onClick={() => setDropdown(false)} style={{ display: 'block', margin: '10px 0', padding: '10px 10px', borderBottom: '1px solid rgba(0,0,0,0.5)' }} to='/my-page'>My page</NavLink>
                    <NavLink className={classes.Nav} onClick={() => setDropdown(false)} style={{ display: 'block', margin: '10px 0', padding: '10px 10px', borderBottom: '1px solid rgba(0,0,0,0.5)' }} to='/logout'>Log out</NavLink>
                </Dropdown>
            </div>
        </>
    )
}

export default Header;
