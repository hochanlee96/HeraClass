import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClassCard from './ClassCard/ClassCard';
import classes from './ClassCardsContainer.module.css';

import * as classActions from '../../store/actions/class-list';


const ClassCardsContainer = props => {

    const allClasses = useSelector(state => state.classList.allClasses);

    const dispatch = useDispatch();

    //fetch classes from the database
    const loadClasses = useCallback(async () => {
        try {
            await dispatch(classActions.fetchClass());
        } catch (error) {
        }
    }, [dispatch]);

    //when this page is rendered, load classes
    useEffect(() => {
        loadClasses().then(() => {
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