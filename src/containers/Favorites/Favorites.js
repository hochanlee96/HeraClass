import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

// import { dbService } from '../../fbase';
import * as authActions from '../../store/actions/auth';
import Class from '../../models/class';
import Spinner from '../../components/UI/Spinner/Spinner';
import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';


const Favorites = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [favoriteClasses, setFavoriteClasses] = useState(null);

    const dispatch = useDispatch();

    const fetchClasses = useCallback(async () => {
        const response = await fetch('http://localhost:3001/user/class-list/favorite', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        let classArray = [];
        const resData = await response.json();
        if (resData.error === "not signed in") {
            dispatch(authActions.logout());
        } else {
            console.log(resData);
            resData.forEach(cl => {
                classArray.push(
                    new Class(
                        cl._id,
                        cl.title,
                        cl.imageUrl,
                        cl.address,
                        [...cl.category],
                        { ...cl.details },
                        [...cl.followers],
                        { ...cl.coordinates },
                        null,
                        [...cl.reviews]
                    ))
            })
            //firebase 이용
            // const fetchedClasses = await dbService.collection("classes").get();
            // const classArray = [];
            // fetchedClasses.forEach(cl => {
            //     const followers = cl.data().followers;
            //     if (!!followers.find(id => id === userId)) {
            // classArray.push(
            //     new Class(
            //         cl.id,
            //         cl.data().title,
            //         cl.data().imageUrl,
            //         cl.data().address,
            //         cl.data().category,
            //         cl.data().details,
            //         cl.data().followers
            //     ))
            //     }
            // }
            // );
            setFavoriteClasses(classArray);
        }
    }, [dispatch]);

    useEffect(() => {
        setIsLoading(true);
        fetchClasses().then(() => setIsLoading(false));
    }, [fetchClasses])

    return (
        <>
            <p>This is the Favorites page</p>
            {isLoading ? <Spinner /> : favoriteClasses ? <ClassListContainer history={props.history} allClasses={favoriteClasses} favPage={true} /> : null}
        </>
    )
}

export default Favorites;