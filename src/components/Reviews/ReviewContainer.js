import React from 'react';

import NewReview from './Review/NewReview';
import Review from './Review/Review';

const ReviewContainer = ({ reviews, classId, userEmail }) => {

    let reviewArray = null;
    if (reviews) {
        reviewArray = reviews.map(review => (
            <Review key={review._id} reviewId={review._id} username={review.author.username} rating={review.rating} review={review.review} date={review.date.toString()} isOwner={review.author.email === userEmail} />
        ))
    }
    return (<>
        <p>Reviews</p>
        <NewReview classId={classId} />
        {reviewArray}
    </>);
}

export default ReviewContainer;