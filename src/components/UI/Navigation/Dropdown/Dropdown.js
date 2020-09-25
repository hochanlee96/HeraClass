import React from 'react';

import classes from './Dropdown.module.css';
import DropdownBackdrop from './DropdownBackdrop';

const Dropdown = props => {

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <DropdownBackdrop
                show={props.show}
                clicked={props.modalClosed} />
            <div
                className={classes.Modal}
                style={{
                    opacity: props.show ? ' ' : '0'
                }}>
                {props.children}
            </div>
        </div>
    )

}

export default Dropdown;