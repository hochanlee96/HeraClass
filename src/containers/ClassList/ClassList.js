import React from 'react';

import Layout from '../../components/hoc/Layout/Layout';
import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';
import classes from './ClassList.module.css';

const ClassList = props => {
    return (
        <Layout>
            <p>This is the Class List container</p>
            <div className={classes.MainContainer}>
                <ClassListContainer history={props.history} />
            </div>
        </Layout>
    )
}

export default ClassList;