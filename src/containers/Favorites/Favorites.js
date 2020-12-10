import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as authActions from '../../store/actions/auth';
import DetailedStudio from '../../models/studio/detailedStudio';
import Spinner from '../../components/UI/Spinner/Spinner';
import StudioCardsContainer from '../../components/StudioCardsContainer/StudioCardsContainer';


const Favorites = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [favoriteStudios, setFavoriteStudios] = useState(null);
    const userEmail = useSelector(state => state.auth.email);
    const dispatch = useDispatch();

    const fetchStudios = useCallback(async () => {
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + '/user/studio-search/favorite', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        let studioArray = [];
        const resData = await response.json();
        if (resData.error === "not signed in") {
            dispatch(authActions.logout());
        } else {
            resData.forEach(studio => {
                studioArray.push(
                    new DetailedStudio(
                        studio._id,
                        studio.title,
                        studio.imageUrl,
                        studio.address,
                        [...studio.category],
                        { ...studio.details },
                        [...studio.followers],
                        { ...studio.coordinates },
                        studio.postedBy,
                        [...studio.reviews]
                    ))
            })

            setFavoriteStudios(studioArray);
        }
    }, [dispatch]);

    useEffect(() => {
        setIsLoading(true);
        fetchStudios().then(() => setIsLoading(false));
    }, [fetchStudios])

    return (
        <>
            <p>This is the Favorites page</p>
            {isLoading ? <Spinner /> : favoriteStudios ? <StudioCardsContainer onlyFavorites userEmail={userEmail} history={props.history} allStudios={favoriteStudios} favPage={true} /> : null}
        </>
    )
}

export default Favorites;