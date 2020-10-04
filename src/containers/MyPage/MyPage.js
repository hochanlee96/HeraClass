import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import classes from './MyPage.module.css';


const MyPage = () => {

    const numFavorites = useSelector(state => state.auth.userData.favorites.length);

    return (
        <>
            <div className={classes.MyPage}>
                <p>This is My Page!</p>
                <Link to='/favorites'>
                    Number of Favorite Classes : {numFavorites}
                </Link>
            </div>
        </>
    )
}

export default MyPage;