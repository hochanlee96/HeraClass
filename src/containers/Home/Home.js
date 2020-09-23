import React from 'react';

import Layout from '../../components/hoc/Layout/Layout';
import classes from './Home.module.css';

import Register from '../../components/Auth/Register/Register';

const Home = props => {
    return (
        <div>
            <Layout>
                <p className={classes.Font}>This is the Home container</p>
                <Register />
            </Layout>
        </div>
    )
}

export default Home;
