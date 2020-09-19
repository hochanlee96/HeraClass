import React from 'react';
import classes from './Header.module.css';

const Header = props => {
    return (
        <div className={classes.Header}>
            <div className={classes.Item}>Logo</div>
            <div className={classes.Item}>Middle</div>
            <div className={classes.Item}>End</div>
        </div>
    )
}

export default Header;
