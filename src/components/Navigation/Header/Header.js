import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Header.module.css';

const Header = props => {
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
            <div className={classes.Item}>End</div>
        </div>
    )
}

export default Header;
