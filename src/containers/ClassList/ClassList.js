import React from 'react';

import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';
import classes from './ClassList.module.css';

const ClassList = props => {

    return (
        <div>
            <p>This is the Class List container</p>
            <div className={classes.MainContainer}>
                <ClassListContainer history={props.history} />
            </div>
        </div>
    )
}

export default ClassList;