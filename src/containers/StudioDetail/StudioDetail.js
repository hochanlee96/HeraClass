import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import { dbService } from '../../fbase';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './StudioDetail.module.css';
import * as studioActions from '../../store/actions/studio-search';
import { FETCH_STUDIO } from '../../store/actions/studio-search';
import * as authActions from '../../store/actions/auth';
import DetailedStudio from '../../models/studio/detailedStudio';
import NaverMap from '../../components/Map/NaverMap';
import ReviewContainer from '../../components/Reviews/ReviewContainer';

const StudioDetail = props => {
    const studioId = props.match.params.studioId;
    const [fetchedStudio, setFetchedStudio] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const isSignedIn = useSelector(state => state.auth.email !== '');
    const userEmail = useSelector(state => state.auth.email);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadedStudio, setLoadedStudio] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!fetchedStudio) {
            setIsFavorite(false)
        } else if (userEmail && fetchedStudio.followers.findIndex(item => item === userEmail) >= 0) {
            setIsFavorite(true)
        }
    }, [fetchedStudio, userEmail])

    // try fetching
    const fetchStudio = useCallback(async studioId => {
        try {

            //서버이용해서 fetch class
            const response = await fetch(`http://localhost:3001/user/studio-search/${studioId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            console.log('searched Studio', resData);
            const studioData = new DetailedStudio(
                resData._id,
                resData.title,
                resData.imageUrl,
                resData.address,
                [...resData.category],
                { ...resData.details },
                [...resData.followers],
                { ...resData.coordinates },
                resData.postedBy,
                [...resData.reviews]
            );
            console.log("Studio Data", studioData);
            setFetchedStudio(studioData)
            dispatch({ type: FETCH_STUDIO, fetchedStudios: [studioData] });
            setLoadedStudio(true);

        } catch (error) {
            throw error;
        }
    }, [dispatch])

    const favoriteToggler = () => {
        if (isSignedIn) {
            if (isFavorite) {
                dispatch(studioActions.updateFollower(studioId, userEmail, false));
                dispatch(authActions.updateFavorites(studioId, false));
                setIsFavorite(false);
            } else {
                dispatch(studioActions.updateFollower(studioId, userEmail, true));
                dispatch(authActions.updateFavorites(studioId, true));
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
        fetchStudio(studioId).then(() => {
            setIsLoading(false);
        });
    }, [studioId, fetchStudio])


    let detail = null;
    if (fetchedStudio) {
        const catList = fetchedStudio.category.map(cat => (
            <p style={{ display: "inline-block", margin: '30px 10px' }} key={cat}>{cat}</p>
        ))
        detail = (
            <div className={classes.DetailContainer}>
                <div className={classes.ImageContainer}>
                    <img src={fetchedStudio.imageUrl} alt='' className={classes.Image} />
                </div>
                <div className={classes.OverviewContainer} >
                    <div className={classes.Description}>
                        <div className={classes.TitleContainer}>
                            <p><strong>{fetchedStudio.title}</strong></p>
                            <button className={isFavorite ? classes.FavoriteButton : classes.Button} onClick={favoriteToggler}>favorite</button>
                        </div>
                    </div>
                    <p className={classes.Description}>{fetchedStudio.address}</p>
                    <p className={classes.Description}>{fetchedStudio.details.tel}</p>
                    <p className={classes.Description}>카테고리</p>
                    {catList}
                </div>
            </div >)
    }

    let map = null;
    if (fetchedStudio && fetchedStudio.coordinates) {
        map = <NaverMap title={[fetchedStudio.title]} coordinates={[{ ...fetchedStudio.coordinates }]} center={{ ...fetchedStudio.coordinates }} zoom={18} printCenter={(center) => console.log(center)} />
    }
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {isLoading ? <Spinner /> : detail}
            {map}
            {loadedStudio ? <ReviewContainer studioId={studioId} userEmail={userEmail} /> : null}
        </div>
    )
}

export default StudioDetail;