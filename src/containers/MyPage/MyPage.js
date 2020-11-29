import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import classes from './MyPage.module.css';


const MyPage = () => {

    const numFavorites = useSelector(state => state.auth.favorites.length);
    const numEvents = useSelector(state => state.auth.events.length);

    return (
        <>
            <div className={classes.MyPage}>
                <p>This is My Page!</p>
                <ul>
                    <li>
                        <Link to='/favorites'>
                            Number of Favorite Studios : {numFavorites}
                        </Link>
                    </li>
                    <li>
                        <Link to='/profile'>
                            My Profile
                        </Link>
                    </li>
                    <li>
                        <Link to='/events'>
                            Number of Events Enrolled : {numEvents}
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default MyPage;