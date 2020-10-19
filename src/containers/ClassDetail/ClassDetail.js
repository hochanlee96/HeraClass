import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { dbService } from '../../fbase';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './ClassDetail.module.css';
import * as classActions from '../../store/actions/class-list';
import * as authActions from '../../store/actions/auth';
import NaverMap from '../../components/Map/NaverMap';

const ClassDetail = props => {
    const classId = props.match.params.classId;
    const [fetchedClass, setFetchedClass] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(null);
    const isSignedIn = useSelector(state => state.auth.token !== null);
    const userId = useSelector(state => state.auth.userId);
    const [isFavorite, setIsFavorite] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!fetchedClass) {
            setIsFavorite(false)
        } else if (userId && fetchedClass.followers.findIndex(item => item === userId) >= 0) {
            setIsFavorite(true)
        }
    }, [fetchedClass, userId])

    // try fetching
    const fetchClass = async classId => {
        try {
            // const response = await fetch(`https://hercules-56a2b.firebaseio.com/class-list/${classId}.json`);
            // if (!response.ok) {
            //     throw new Error('Something went wrong!');
            // }

            // const resData = await response.json();
            // setFetchedClass({
            //     title: resData.title,
            //     imageUrl: resData.imageUrl,
            //     address: resData.address,
            //     details: { ...resData.details },
            //     category: [...resData.category]
            // })

            const docRef = dbService.collection("classes").doc(`${classId}`);
            docRef.get().then((doc) => {
                setFetchedClass({
                    title: doc.data().title,
                    imageUrl: doc.data().imageUrl,
                    address: doc.data().address,
                    details: { ...doc.data().details },
                    category: [...doc.data().category],
                    followers: [...doc.data().followers],
                });
                setCoordinates({ lat: doc.data().coordinates.latitude, lng: doc.data().coordinates.longitude })
            }).catch(err => {
                // console.log('Unable to reach');
            });
        } catch (error) {
            throw error;
        }
    }
    const favoriteToggler = () => {
        if (isSignedIn) {
            if (isFavorite) {
                dispatch(classActions.updateFollower(classId, userId, false));
                dispatch(authActions.updateFavorites(classId, userId, false));
                setIsFavorite(false);
            } else {
                dispatch(classActions.updateFollower(classId, userId, true));
                dispatch(authActions.updateFavorites(classId, userId, true));
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
    }, [classId])


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
    if (coordinates) {
        map = <NaverMap title={fetchedClass.title} lat={coordinates.lat} lng={coordinates.lng} />
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {isLoading ? <Spinner /> : detail}
            {map}
        </div>
    )
}

export default ClassDetail;