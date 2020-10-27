import React, { useEffect, useCallback } from 'react';

import classes from './Home.module.css';

const Home = () => {

    const user = useCallback(async () => {
        const response = await fetch('http://localhost:3001/', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const data = await response.json();
        console.log(data);
    }, [])

    useEffect(() => {
        user();
    }, [user])

    return (
        <div>
            <p className={classes.Font}>This is the Home container</p>
        </div>
    )
}

export default Home;
