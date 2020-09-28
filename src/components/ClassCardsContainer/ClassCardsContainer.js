import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClassCard from './ClassCard/ClassCard';
import Spinner from '../UI/Spinner/Spinner';
import classes from './ClassCardsContainer.module.css';

import * as classActions from '../../store/actions/class-list';


const ClassCardsContainer = props => {

    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        loadClasses().then(() => {
            setIsLoading(false)
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
            {isLoading ? <Spinner /> : classList}
        </div>
    )
}

export default ClassCardsContainer;