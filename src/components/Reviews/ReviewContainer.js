import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import NewReview from './Review/NewReview';
import Review from './Review/Review';

const ReviewContainer = ({ studioId, userEmail }) => {

    const [reviews, setReviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const fetchedStudio = useSelector(state => { return state.studioList.allStudios[0] })

    useEffect(() => {
        if (fetchedStudio) {
            const sortedReviews = fetchedStudio.reviews.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            })
            setReviews([...sortedReviews])
        }
    }, [fetchedStudio])

    const reviewEdited = (reviewId, newReview) => {
        setReviews(prev => {
            const updatedReviews = [...prev];
            const reviewIndex = prev.findIndex(review => review._id === reviewId);
            updatedReviews[reviewIndex] = { ...newReview }
            return updatedReviews;
        })
    }

    const reviewDeleted = (reviewId) => {
        setReviews(prev => {
            const updatedReviews = [...prev]
            const reviewIndex = prev.findIndex(review => review._id === reviewId);
            updatedReviews.splice(reviewIndex, 1);
            return updatedReviews;
        })
    }

    const editingHandler = () => {
        setIsEditing(prev => !prev)
    }

    let reviewArray = null;
    if (reviews) {
        reviewArray = reviews.map((review, index) => (
            <Review key={review._id} reviewId={review._id} username={review.author.username} rating={review.rating} review={review.review} date={review.date.toString()} isOwner={review.author.email === userEmail} reviewEdited={(newReview) => reviewEdited(review._id, newReview)} reviewDeleted={() => reviewDeleted(review._id)} editingHandler={editingHandler} />
        ))
    }

    return (<>
        <p><strong>Reviews</strong></p>
        {isEditing ? null : <NewReview studioId={studioId} />}
        {reviewArray}
    </>);
}

export default ReviewContainer;