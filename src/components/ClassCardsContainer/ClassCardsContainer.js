import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClassCard from './ClassCard/ClassCard';
import classes from './ClassCardsContainer.module.css';
// import CLASSES from '../../data/dummy-data';

import * as classActions from '../../store/actions/class-list';


const ClassCardsContainer = props => {

    const allClasses = useSelector(state => state.allClasses.allClasses);
    // const [error, setError] = useState();
    // const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const loadClasses = useCallback(async () => {
        // setError(null);
        try {
            await dispatch(classActions.fetchClass());
        } catch (error) {
            // setError(error.message);
        }
    }, [dispatch, /*setIsLoading, setError*/]);

    useEffect(() => {
        // setIsLoading(true);
        loadClasses().then(() => {
            // setIsLoading(false);
        });
    }, [dispatch, loadClasses])


    const classList = allClasses.map(classData => {
        return (
            <ClassCard
                history={props.history}
                key={classData.id}
                classId={classData.id}
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