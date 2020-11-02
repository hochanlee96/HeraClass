import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import { dbService } from '../../fbase';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './ClassDetail.module.css';
import * as classActions from '../../store/actions/class-list';
import { FETCH_CLASS } from '../../store/actions/class-list';
import * as authActions from '../../store/actions/auth';
import Class from '../../models/class';
import NaverMap from '../../components/Map/NaverMap';

const ClassDetail = props => {
    const classId = props.match.params.classId;
    const [fetchedClass, setFetchedClass] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const isSignedIn = useSelector(state => state.auth.email !== '');
    const userEmail = useSelector(state => state.auth.email);
    const [isFavorite, setIsFavorite] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!fetchedClass) {
            setIsFavorite(false)
        } else if (userEmail && fetchedClass.followers.findIndex(item => item === userEmail) >= 0) {
            setIsFavorite(true)
        }
    }, [fetchedClass, userEmail])

    // try fetching
    const fetchClass = useCallback(async classId => {
        try {

            //서버이용해서 fetch class
            const response = await fetch(`http://localhost:3001/class-list/${classId}`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const classData = new Class(
                resData._id,
                resData.title,
                resData.imageUrl,
                resData.address,
                resData.category,
                resData.details,
                resData.followers,
                { ...resData.coordinates }
            );
            setFetchedClass(classData)
            dispatch({ type: FETCH_CLASS, fetchedClasses: [classData] });

            //firebase를 이용해서 fetch class
            // const docRef = dbService.collection("classes").doc(`${classId}`);
            // docRef.get().then((doc) => {
            //     setFetchedClass({
            //         title: doc.data().title,
            //         imageUrl: doc.data().imageUrl,
            //         address: doc.data().address,
            //         details: { ...doc.data().details },
            //         category: [...doc.data().category],
            //         followers: [...doc.data().followers],
            //     });
            //     setCoordinates({ lat: doc.data().coordinates.latitude, lng: doc.data().coordinates.longitude })
            // }).catch(err => {
            //     console.log('Unable to reach');
            // });
        } catch (error) {
            throw error;
        }
    }, [dispatch])
    const favoriteToggler = () => {
        if (isSignedIn) {
            if (isFavorite) {
                dispatch(classActions.updateFollower(classId, userEmail, false));
                dispatch(authActions.updateFavorites(classId, false));
                setIsFavorite(false);
            } else {
                dispatch(classActions.updateFollower(classId, userEmail, true));
                dispatch(authActions.updateFavorites(classId, true));
                setIsFavorite(true);
            }
        } else {
            const ok = window.confirm("You need to login first! Do you want to login?");
            if (ok) {
                props.history.push('/auth');
            }
        }
    }
    useEffect(() => {
        setIsLoading(true);
        fetchClass(classId).then(() => {
            setIsLoading(false);
        });
    }, [classId, fetchClass])


    let detail = null;
    if (fetchedClass) {
        const catList = fetchedClass.category.map(cat => (
            <p style={{ display: "inline-block", margin: '30px 10px' }} key={cat}>{cat}</p>
        ))
        detail = (
            <div className={classes.DetailContainer}>
                <div className={classes.ImageContainer}>
                    <img src={fetchedClass.imageUrl} alt='' className={classes.Image} />
                </div>
                <div className={classes.OverviewContainer} >
                    <div className={classes.Description}>
                        <div className={classes.TitleContainer}>
                            <p><strong>{fetchedClass.title}</strong></p>
                            <button className={isFavorite ? classes.FavoriteButton : classes.Button} onClick={favoriteToggler}>favorite</button>
                        </div>
                    </div>
                    <p className={classes.Description}>{fetchedClass.address}</p>
                    <p className={classes.Description}>{fetchedClass.details.tel}</p>
                    <p className={classes.Description}>카테고리</p>
                    {catList}
                </div>
            </div >)
    }

    let map = null;
    if (fetchedClass && fetchedClass.coordinates) {
        map = <NaverMap title={[fetchedClass.title]} coordinates={[{ ...fetchedClass.coordinates }]} center={{ ...fetchedClass.coordinates }} zoom={18} />
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {isLoading ? <Spinner /> : detail}
            {map}
        </div>
    )
}

export default ClassDetail;