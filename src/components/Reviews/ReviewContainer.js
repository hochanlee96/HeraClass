import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import NewReview from './Review/NewReview';
import Review from './Review/Review';

const ReviewContainer = ({ classId, userEmail }) => {

    const [reviews, setReviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const fetchedClass = useSelector(state => { return state.classList.allClasses[0] })

    useEffect(() => {
        if (fetchedClass) {
            setReviews([...fetchedClass.reviews])
        }
    }, [fetchedClass])

    const reviewAdded = newReview => {
        setReviews(prev => [newReview, ...prev])
    }

    const reviewEdited = (reviewIndex, newReview) => {
        setReviews(prev => {
            const updatedReviews = [...prev];
            updatedReviews[reviewIndex] = { ...newReview }
            return updatedReviews;
        })
    }

    const reviewDeleted = (reviewIndex) => {
        setReviews(prev => {
            const updatedReviews = [...prev]
            updatedReviews.splice(reviewIndex, 1)
            return updatedReviews;
        })
    }

    const editingHandler = () => {
        setIsEditing(prev => !prev)
    }

    let reviewArray = null;
    if (reviews) {
        reviewArray = reviews.map((review, index) => (
            <Review key={index} reviewId={review._id} username={review.author.username} rating={review.rating} review={review.review} date={review.date.toString()} isOwner={review.author.email === userEmail} reviewEdited={(newReview) => reviewEdited(index, newReview)} reviewDeleted={() => reviewDeleted(index)} editingHandler={editingHandler} />
        ))
    }

    return (<>
        <p>Reviews</p>
        {isEditing ? null : <NewReview classId={classId} reviewAdded={(newReview) => reviewAdded(newReview)} />}
        {reviewArray}
    </>);
}

export default ReviewContainer;