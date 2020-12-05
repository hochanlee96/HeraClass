import React from 'react';

import classes from './Home.module.css';


const Home = () => {


    const sendMessage = async () => {
        const response = await fetch('http://localhost:3001/sms/test', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const resData = await response.json();
        console.log(resData);
    }
    return (
        <div>
            <p className={classes.Font}>This is the Home container</p>
            {/* test */}
            <button onClick={sendMessage}>send test sms</button>
        </div>
    )
}

export default Home;
