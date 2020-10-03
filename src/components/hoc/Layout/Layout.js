import React from 'react';

import classes from './Layout.module.css';
import Header from '../../UI/Navigation/Header/Header';

const Layout = props => {
    return (
        <>
            <div className={classes.Header}>
                <Header history={props.history} />
            </div>
            <div className={classes.Body}>{props.children}</div>
            <div className={classes.Footer}>Footer</div>
        </>
    )
}

export default Layout;