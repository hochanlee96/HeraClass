import React from 'react';

import classes from './Layout.module.css';
import Header from '../../UI/Navigation/Header/Header';

const Layout = props => {
    return (
        <div>
            <div className={classes.Header}>
                <Header />
            </div>
            <div className={classes.Body}>{props.children}</div>
            <div className={classes.Footer}>Footer</div>
        </div>
    )
}

export default Layout;