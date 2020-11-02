import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';
import classes from './ClassList.module.css';
import * as classActions from '../../store/actions/class-list';
import Spinner from '../../components/UI/Spinner/Spinner';
import NaverMap from '../../components/Map/NaverMap';

const ClassList = props => {

    const allClasses = useSelector(state => state.classList.allClasses);
    const userEmail = useSelector(state => state.auth.email);
    const [isLoading, setIsLoading] = useState(false);
    const [center, setCenter] = useState({ latitude: "37.5624917", longitude: "126.9724786" });

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

    let navermap;
    if (allClasses) {
        const classTitles = [];
        const classCoordinates = [];
        allClasses.forEach(cl => {
            classTitles.push(cl.title)
            if (cl.coordinates) {
                classCoordinates.push({ ...cl.coordinates })
            }
        })

        navermap = <NaverMap title={classTitles} coordinates={classCoordinates} center={center} zoom={13} printCenter={center => setCenter({ latitude: center._lat, longitude: center._lng })} />
    }

    return (
        <div>
            <p>This is the Class List container</p>
            <div className={classes.MainContainer}>
                {isLoading ? <Spinner /> : <ClassListContainer history={props.history} allClasses={allClasses} userEmail={userEmail} favPage={false} />}
            </div>
            {navermap}
        </div>
    )
}

export default ClassList;