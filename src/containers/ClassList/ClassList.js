import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';
import classes from './ClassList.module.css';
import * as classActions from '../../store/actions/class-list';
import Spinner from '../../components/UI/Spinner/Spinner';

const ClassList = props => {

    const allClasses = useSelector(state => state.classList.allClasses);
    const userId = useSelector(state => state.auth.userId);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div>
            <p>This is the Class List container</p>
            <div className={classes.MainContainer}>
                {isLoading ? <Spinner /> : <ClassListContainer history={props.history} allClasses={allClasses} userId={userId} />}
            </div>
        </div>
    )
}

export default ClassList;