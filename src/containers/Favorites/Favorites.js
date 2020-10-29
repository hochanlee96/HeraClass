import React, { useState, useEffect, useCallback } from 'react';

// import { dbService } from '../../fbase';
import Class from '../../models/class';
import Spinner from '../../components/UI/Spinner/Spinner';
import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';


const Favorites = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [favoriteClasses, setFavoriteClasses] = useState(null);

    const fetchClasses = useCallback(async () => {
        const response = await fetch('http://localhost:3001/class-list/favorite', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        let classArray = [];
        const resData = await response.json();
        resData.forEach(cl => {
            classArray.push(
                new Class(
                    cl._id,
                    cl.title,
                    cl.imageUrl,
                    cl.address,
                    cl.category,
                    cl.details,
                    cl.followers
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
    }, []);

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