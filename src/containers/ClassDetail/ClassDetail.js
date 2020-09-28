import React, { useState, useEffect } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './ClassDetail.module.css';

const ClassDetail = props => {
    const classId = props.match.params.classId;
    const [selectedClass, setFetchedClass] = useState();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // try fetching
    const fetchClass = async classId => {
        try {
            const response = await fetch(`https://hercules-56a2b.firebaseio.com/class-list/${classId}.json`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            setFetchedClass({
                title: resData.title,
                imageUrl: resData.imageUrl,
                address: resData.address,
                details: { ...resData.details },
                category: [...resData.category]
            })

        } catch (error) {
            throw error;
        }
    }

    const favoriteToggler = () => {
        //dispatch favorites
        setIsFavorite(prev => !prev);
    }

    useEffect(() => {
        setIsLoading(true);
        fetchClass(classId).then(() => {
            setIsLoading(false);
        });
    }, [classId])


    let detail = null;
    if (selectedClass) {
        const catList = selectedClass.category.map(cat => (
            <p key={cat}>{cat}</p>
        ))
        detail = (
            <div className={classes.DetailContainer}>
                <div className={classes.ImageContainer}>
                    <img src={selectedClass.imageUrl} alt='' className={classes.Image} />
                </div>
                <div className={classes.OverviewContainer} >
                    <div className={classes.Description}>
                        <div className={classes.TitleContainer}>
                            <p><strong>{selectedClass.title}</strong></p>
                            <button className={isFavorite ? classes.FavoriteButton : classes.Button} onClick={favoriteToggler}>favorite</button>
                        </div>
                    </div>
                    <p className={classes.Description}>{selectedClass.address}</p>
                    <p className={classes.Description}>{selectedClass.details.tel}</p>
                    <p className={classes.Description}>카테고리</p>
                    {catList}
                </div>
            </div >)
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {isLoading ? <Spinner /> : detail}
        </div>
    )
}

export default ClassDetail;