import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { dbService } from '../../fbase';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './ClassDetail.module.css';
import * as classActions from '../../store/actions/class-list';
import * as authActions from '../../store/actions/auth';

const ClassDetail = props => {
    const classId = props.match.params.classId;
    const [selectedClass, setFetchedClass] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const isSignedIn = useSelector(state => state.auth.token !== null);
    const [isFavorite, setIsFavorite] = useState(false);
    const userId = useSelector(state => state.auth.userId);
    const isFav = useSelector(state => state.auth.userData.favorites.findIndex(el => el === classId) >= 0);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isFav) {
            setIsFavorite(true);
        }
    }, [isFav]);

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
            docRef.get().then((doc) =>
                setFetchedClass({
                    title: doc.data().title,
                    imageUrl: doc.data().imageUrl,
                    address: doc.data().address,
                    details: { ...doc.data().details },
                    category: [...doc.data().category],
                    follwers: [...doc.data().followers]
                }));
        } catch (error) {
            throw error;
        }
    }

    const favoriteToggler = () => {
        //dispatch favorites
        console.log(isFav);
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
            // setIsFavorite(prev => !prev);
            // console.log(favoritesList);
        } else {
            //modal leading to login
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
    if (selectedClass) {
        const catList = selectedClass.category.map(cat => (
            <p key={cat}>{cat}</p>
        ))
        detail = (
            <div className={classes.DetailContainer}>
                <div className={classes.ImageContainer}>
                    <img src={selectedClass.imageUrl} alt='' className={classes.Image} />
                </div>
                <div className={classes.OverviewContainer} >
                    <div className={classes.Description}>
                        <div className={classes.TitleContainer}>
                            <p><strong>{selectedClass.title}</strong></p>
                            <button className={isFavorite ? classes.FavoriteButton : classes.Button} onClick={favoriteToggler}>favorite</button>
                        </div>
                    </div>
                    <p className={classes.Description}>{selectedClass.address}</p>
                    <p className={classes.Description}>{selectedClass.details.tel}</p>
                    <p className={classes.Description}>카테고리</p>
                    {catList}
                </div>
            </div >)
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {isLoading ? <Spinner /> : detail}
        </div>
    )
}

export default ClassDetail;