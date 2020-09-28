import React from 'react';

import classes from './MyPage.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';

const MyPage = props => {
    return (
        <div className={classes.MyPage}>
            <p>This is My Page!</p>
            <Spinner />
        </div>
    )
}

export default MyPage;