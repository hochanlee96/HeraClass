import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { dbService } from '../../fbase';

import classes from './MyPage.module.css';
import Class from '../../models/class';
import Spinner from '../../components/UI/Spinner/Spinner';
import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';


const MyPage = props => {
    const userId = useSelector(state => state.auth.userId);
    const [isLoading, setIsLoading] = useState(false);
    const [viewFavorites, setViewFavorites] = useState(false);
    const [favoriteClasses, setFavoriteClasses] = useState(null);

    const viewFavoritesToggler = () => {
        setViewFavorites(prev => !prev)
    }

    const fetchClasses = useCallback(async () => {
        if (viewFavorites) {
            const fetchedClasses = await dbService.collection("classes").get();
            const classArray = [];
            fetchedClasses.forEach(cl => {
                const followers = cl.data().followers;
                if (!!followers.find(id => id === userId)) {
                    classArray.push(
                        new Class(
                            cl.id,
                            cl.data().title,
                            cl.data().imageUrl,
                            cl.data().address,
                            cl.data().category,
                            cl.data().details,
                            cl.data().followers
                        ))
                }
            }
            );
            setFavoriteClasses(classArray);
        }
    }, [viewFavorites, userId]);

    useEffect(() => {
        setIsLoading(true);
        fetchClasses().then(() => setIsLoading(false));
    }, [fetchClasses])

    return (
        <div className={classes.MyPage}>
            <p>This is My Page!</p>
            <button onClick={viewFavoritesToggler}>View My Favorite Classes</button>
            {viewFavorites ? (isLoading ? <Spinner /> : favoriteClasses ? <ClassListContainer history={props.history} allClasses={favoriteClasses} /> : null) : null}
        </div>
    )
}

export default MyPage;