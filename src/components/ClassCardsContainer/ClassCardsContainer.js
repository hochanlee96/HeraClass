import React, { useState, useEffect } from 'react';

import ClassCard from './ClassCard/ClassCard';
import classes from './ClassCardsContainer.module.css';

const ClassCardsContainer = props => {

    const [isSignedIn, setIsSignedIn] = useState(false);

    const { userId } = props;

    useEffect(() => {
        userId ? setIsSignedIn(true) : setIsSignedIn(false);
    }, [userId])

    const classList = props.allClasses.map(classData => {
        let isFavorite = false;
        if (isSignedIn && (!!classData.followers.find(user => user === props.userId))) {
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