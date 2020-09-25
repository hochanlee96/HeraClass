import React from 'react';

import classes from './DropdownBackdrop.module.css';

const DropdownBackdrop = props => (
    props.show
        ? <div
            className={classes.Backdrop}
            onClick={props.clicked} ></div>
        : null
)

export default DropdownBackdrop;