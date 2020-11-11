import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classes from './ClassCard.module.css';
import * as classActions from '../../../store/actions/class-list';
import * as authActions from '../../../store/actions/auth';

const ClassCard = props => {
    const isSignedIn = useSelector(state => state.auth.email !== '');
    const userEmail = useSelector(state => state.auth.email);

    const dispatch = useDispatch();

    const clickHandler = classId => {
        props.history.push(`/detail/${classId}`);;
    }
    const { isFavorite } = props;

    const favoriteToggler = classId => {
        if (isSignedIn) {
            if (isFavorite) {
                dispatch(classActions.updateFollower(classId, userEmail, false));
                dispatch(authActions.updateFavorites(classId, false));
            } else {
                dispatch(classActions.updateFollower(classId, userEmail, true));
                dispatch(authActions.updateFavorites(classId, true));
            }
        } else {
            const ok = window.confirm("You need to login first! Do you want to login?");
            if (ok) {
                props.history.push('/auth');
            }
        }
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
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p style={{ display: "inline-block" }}>{props.avgRating ? `avg rating : ${props.avgRating}` : "No rating yet"}</p>
                        <p style={{ display: "inline-block" }}># Reviews : {props.nReviews}</p>
                        <p style={{ display: "inline-block" }}>distance : {props.distance > 1 ? Math.round(props.distance * 10) / 10 + " km" : Math.round(props.distance * 10) * 100 + ' m'}</p>
                    </div>
                    <p>{props.address}</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "inline-block", margin: "10px 5px" }}>
                            {categories}
                        </div>
                        <div className={classes.Placeholder}></div>
                    </div>
                </div>
            </div>
            {props.favPage ? null : <div onClick={() => favoriteToggler(props.classId)} className={isFavorite ? classes.FavoriteButton : classes.Button}>Favorite</div>}
        </div>
    )
}

export default ClassCard;