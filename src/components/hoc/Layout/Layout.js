import React from 'react';
import classes from './Layout.module.css';

const Layout = props => {
    return (
        <div>
            <div className={classes.Header}>Header</div>
            <div className={classes.Body}>{props.children}</div>
            <div className={classes.Footer}>Footer</div>
        </div>
    )
}

export default Layout;