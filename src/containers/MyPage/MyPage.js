import React, { useState } from 'react';

import classes from './MyPage.module.css';

const MyPage = props => {
    const [viewFavorites, setViewFavorites] = useState(false);

    const viewFavoritesToggler = () => {
        setViewFavorites(prev => !prev)
    }

    return (
        <div className={classes.MyPage}>
            <p>This is My Page!</p>
            <button onClick={viewFavoritesToggler}>View My Favorite Classes</button>
            {viewFavorites ? <p>Favorites</p> : <p>Hide</p>}
        </div>
    )
}

export default MyPage;