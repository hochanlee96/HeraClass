import React, { useState, useEffect, useCallback } from 'react';

import publicIp from 'react-public-ip';

import classes from './Home.module.css';


const Home = () => {

    const [ip, setIp] = useState('');

    const getIp = useCallback(async () => {
        const ipv4 = await publicIp.v4() || "";
        setIp(ipv4);
    }, [])

    useEffect(() => {
        getIp();
    }, [])

    console.log(ip);

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
