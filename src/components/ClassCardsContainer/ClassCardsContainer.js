import React from 'react';

import ClassCard from './ClassCard/ClassCard';
import CLASSES from '../../data/dummy-data';
import classes from './ClassCardsContainer.module.css';

const ClassCardsContainer = props => {

    const classList = CLASSES.map(classData => {
        return (
            <ClassCard
                imageUrl={classData.imageUrl}
                title={classData.title}
                address={classData.address}
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