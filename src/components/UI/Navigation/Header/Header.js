import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Header.module.css';
import Backdrop from '../../Backdrop/Backdrop';

const Header = props => {
    const [showBackdrop, setShowBackdrop] = useState(false);

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
            <div className={classes.Item}>
                <button onClick={() => {
                    setShowBackdrop(true);
                }}>Login</button>
                <button>Sign Up</button>
            </div>
            <Backdrop
                show={showBackdrop}
                clicked={() => {
                    setShowBackdrop(false)
                }} />
        </div>
    )
}

export default Header;
