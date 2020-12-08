import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

// import { dbService } from '../../fbase';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './StudioDetail.module.css';
import * as studioActions from '../../store/actions/studio-search';
import { FETCH_STUDIO } from '../../store/actions/studio-search';
import * as authActions from '../../store/actions/auth';
import DetailedStudio from '../../models/studio/detailedStudio';
import NaverMap from '../../components/Map/NaverMap';
import ReviewContainer from '../../components/Reviews/ReviewContainer';
import EventsContainer from '../../components/Event/EventsContainer/EventsContainer';

const StudioDetail = props => {

    const history = useHistory();
    const match = useRouteMatch();

    const studioId = props.match.params.studioId;
    const [fetchedStudio, setFetchedStudio] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const isSignedIn = useSelector(state => state.auth.email !== '');
    const isVerified = useSelector(state => state.auth.verified);
    const userEmail = useSelector(state => state.auth.email);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadedStudio, setLoadedStudio] = useState(false);
    const [eventsArray, setEventsArray] = useState(null);
    // const [eventToday, setEventToday] = useState(null);

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
                [...resData.reviews],
                [...resData.events]
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
                dispatch({ type: authActions.SET_REDIRECT_PATH, redirect_path: match.url })
            }
        }
    }
    useEffect(() => {
        setIsLoading(true);
        fetchStudio(studioId).then(() => {
            setIsLoading(false);
        });
    }, [studioId, fetchStudio])

    useEffect(() => {
        if (fetchedStudio) {
            setEventsArray(fetchedStudio.events)
        }
    }, [fetchedStudio])

    const joinEvent = async eventId => {
        //
        if (isSignedIn) {
            if (isVerified) {
                const response = await fetch(`http://localhost:3001/event/${eventId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        join: true
                    })
                });
                if (response.status === 200) {
                    console.log("added");
                    history.go(0);
                }
                const resData = await response.json();
                console.log(resData);
                if (resData.error === 'full') {
                    window.alert('The event is full!')
                }
            } else {
                const ok = window.confirm("You have to verify your email. Verify now?");
                if (ok) {
                    history.push('/profile');
                }
            }
        } else {
            const ok = window.confirm("Do you want to log in first?");
            if (ok) {
                history.push('/auth');
                dispatch({ type: authActions.SET_REDIRECT_PATH, redirect_path: match.url })
            }
        }
    }

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


    // useEffect(() => {
    //     if (fetchedStudio && fetchedStudio.events) {
    //         const today = new Date().toLocaleDateString();
    //         const allEvents = [...fetchedStudio.events];
    //         allEvents.forEach(event => {
    //             console.log(new Date(event.date).toLocaleDateString() === today)
    //         });
    //         allEvents.filter(event => new Date(event.date).toLocaleDateString() === today);
    //         console.log('aall', allEvents)
    //         setEventToday(allEvents);
    //     }
    // }, [fetchedStudio])

    // let events = null;
    // if (eventsArray) {
    //     events = fetchedStudio.events.map(event => {
    //         let enrolled = false;
    //         if (userEmail && event.students.findIndex(studentEmail => studentEmail === userEmail) > -1) {
    //             enrolled = true;
    //         }
    //         return (
    //             <div key={event._id}>
    //                 <p>title : {event.title}</p>
    //                 <p>trainer: {event.trainer}</p>
    //                 <p>date: {new Date(event.date).toLocaleDateString()}</p>
    //                 <p>duration: {event.duration}</p>
    //                 <p>difficulty: {event.difficulty}</p>
    //                 <p>category: {event.category}</p>
    //                 <p>capacity: {event.capacity}</p>
    //                 <p># students enrolled: {event.students.length}</p>
    //                 {(event.capacity <= event.students.length) ? <p>Full</p> : enrolled ? <p>You are enrolled in this event!</p> : <button onClick={() => joinEvent(event._id)}>Join</button>}
    //             </div>
    //         )
    //     })
    // }
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {isLoading ? <Spinner /> : detail}
            {map}
            <EventsContainer studioId={studioId} eventsArray={eventsArray} userEmail={userEmail} joinEvent={(eventId) => joinEvent(eventId)} />
            {/* {events} */}
            {loadedStudio ? <ReviewContainer studioId={studioId} userEmail={userEmail} /> : null}
        </div >
    )
}

export default StudioDetail;