import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import classes from './StudioCard.module.css';
import * as studioActions from '../../../store/actions/studio-search';
import * as authActions from '../../../store/actions/auth';

const StudioCard = props => {
    const isSignedIn = useSelector(state => state.auth.email !== '');
    const userEmail = useSelector(state => state.auth.email);

    const dispatch = useDispatch();
    const match = useRouteMatch();

    const clickHandler = studioId => {
        props.history.push(`/detail/${studioId}`);
    }
    const { isFavorite } = props;

    const favoriteToggler = studioId => {
        if (isSignedIn) {
            if (isFavorite) {
                dispatch(studioActions.updateFollower(studioId, userEmail, false));
                dispatch(authActions.updateFavorites(studioId, false));
            } else {
                dispatch(studioActions.updateFollower(studioId, userEmail, true));
                dispatch(authActions.updateFavorites(studioId, true));
            }
        } else {
            const ok = window.confirm("You need to login first! Do you want to login?");
            if (ok) {
                props.history.push('/auth');
                dispatch({ type: authActions.SET_REDIRECT_PATH, redirect_path: match.url })
            }
        }
    }

    const categories = props.category.map(cat => <p key={cat} style={{ display: 'inline-block', margin: '5px 5px' }}>{cat}</p>)

    return (
        <div className={classes.Container}>
            <div className={classes.StudioCard} onClick={() => clickHandler(props.studioId)}>
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
            {props.favPage ? null : <div onClick={() => favoriteToggler(props.studioId)} className={isFavorite ? classes.FavoriteButton : classes.Button}>Favorite</div>}
        </div>
    )
}

export default StudioCard;