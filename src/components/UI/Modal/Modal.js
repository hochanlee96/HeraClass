import React from 'react';

import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = props => {

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Backdrop
                show={props.show}
                clicked={props.modalClosed} />
            <div
                className={classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(100vh)',
                    opacity: props.show ? ' ' : '0'
                }}>
                {props.children}
            </div>
        </div>
    )

}

export default Modal;