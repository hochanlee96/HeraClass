import React, { useState, useEffect } from 'react';

import StudioCard from './StudioCard/StudioCard';
import classes from './StudioCardsContainer.module.css';

const StudioCardsContainer = props => {

    const [isSignedIn, setIsSignedIn] = useState(false);

    const { userEmail, onlyFavorites } = props;

    useEffect(() => {
        userEmail ? setIsSignedIn(true) : setIsSignedIn(false);
    }, [userEmail])


    let sortedStudios = props.allStudios;
    if (!onlyFavorites) {
        sortedStudios.sort((a, b) => {
            return a.distance - b.distance
        })
    }

    const studioList = sortedStudios.map(studio => {
        let isFavorite = false;
        if (isSignedIn && (!!studio.followers.find(user => user === props.userEmail))) {
            isFavorite = true;
        }
        return (
            <StudioCard
                history={props.history}
                key={studio.id}
                studioId={studio.id}
                imageUrl={studio.imageUrl}
                title={studio.title}
                address={studio.address}
                category={studio.category}
                isFavorite={isFavorite}
                favPage={props.favPage}
                avgRating={studio.avgRating}
                distance={studio.distance}
                nReviews={studio.nReviews}
            />
        )

    });

    return (
        <div className={classes.StudioList}>
            {studioList}
        </div>
    )
}

export default StudioCardsContainer;