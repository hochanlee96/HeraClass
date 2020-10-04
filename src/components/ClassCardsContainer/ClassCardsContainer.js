import React from 'react';

import ClassCard from './ClassCard/ClassCard';
import classes from './ClassCardsContainer.module.css';

const ClassCardsContainer = props => {

    const classList = props.allClasses.map(classData => {
        return (
            <ClassCard
                history={props.history}
                key={classData.id}
                classId={classData.id}
                imageUrl={classData.imageUrl}
                title={classData.title}
                address={classData.address}
                category={classData.category}
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