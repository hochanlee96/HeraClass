import React from 'react';

import classes from './ClassCard.module.css';

const ClassCard = props => {

    const clickHandler = () => {
        console.log("clicked!");
    }

    return (
        <div className={classes.ClassCard} onClick={clickHandler}>
            <div className={classes.ImageContainer}>
                <img className={classes.Image} src={props.imageUrl} alt='' />
            </div>
            <div className={classes.Summary}>
                <p className={classes.Title}>{props.title}</p>
                <p>{props.address}</p>
                <div>Category Area</div>
            </div>
        </div>
    )
}

export default ClassCard;