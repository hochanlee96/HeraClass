import React, { useState } from 'react';

import classes from './ClassCard.module.css';

const ClassCard = props => {
    const [isFav, setIsFav] = useState(false);

    const clickHandler = classId => {
        props.history.push(`/detail/${classId}`);;
    }

    const favToggler = () => {
        setIsFav(prev => !prev);
    }

    const categories = props.category.map(cat => <p key={cat} style={{ display: 'inline-block', margin: '5px 5px' }}>{cat}</p>)

    return (
        <div className={classes.Container}>
            <div className={classes.ClassCard} onClick={() => clickHandler(props.classId)}>
                <div className={classes.ImageContainer}>
                    <img className={classes.Image} src={props.imageUrl} alt='' />
                </div>
                <div className={classes.Summary}>
                    <p className={classes.Title}>{props.title}</p>
                    <p>{props.address}</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "inline-block", margin: "10px 10px" }}>
                            {categories}
                        </div>
                        <div className={classes.Placeholder}></div>
                    </div>
                </div>
            </div>
            <div onClick={favToggler} className={props.isFavorite && isFav ? classes.FavoriteButton : classes.Button}>Favorite</div>
        </div>
    )
}

export default ClassCard;