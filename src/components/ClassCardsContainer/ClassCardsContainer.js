import React, { useState, useEffect } from 'react';

import ClassCard from './ClassCard/ClassCard';
import classes from './ClassCardsContainer.module.css';

const ClassCardsContainer = props => {

    const [isSignedIn, setIsSignedIn] = useState(false);

    const { userEmail, onlyFavorites } = props;

    useEffect(() => {
        userEmail ? setIsSignedIn(true) : setIsSignedIn(false);
    }, [userEmail])


    let sortedClass = props.allClasses;
    if (!onlyFavorites) {
        sortedClass.sort((a, b) => {
            return a.distance - b.distance
        })
    }

    const classList = sortedClass.map(classData => {
        let isFavorite = false;
        if (isSignedIn && (!!classData.followers.find(user => user === props.userEmail))) {
            isFavorite = true;
        }
        return (
            <ClassCard
                history={props.history}
                key={classData.id}
                classId={classData.id}
                imageUrl={classData.imageUrl}
                title={classData.title}
                address={classData.address}
                category={classData.category}
                isFavorite={isFavorite}
                favPage={props.favPage}
                avgRating={classData.avgRating}
                distance={classData.distance}
                nReviews={classData.nReviews}
            />
        )

    });

    return (
        <div className={classes.ClassList}>
            {classList}
        </div>
    )
}

export default ClassCardsContainer;