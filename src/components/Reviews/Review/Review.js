import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import * as authActions from '../../../store/actions/auth';

const Review = ({ editingHandler, reviewEdited, reviewDeleted, reviewId, username, rating, review, date, isOwner }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const classId = match.params.classId;

    const [isEdit, setIsEdit] = useState(false);
    const [tempRatingInput, setTempRatingInput] = useState('');
    const [tempReviewInput, setTempReviewInput] = useState('');
    const [ratingInput, setRatingInput] = useState(rating);
    const [reviewInput, setReviewInput] = useState(review);

    const cancelEdit = () => {
        setRatingInput(tempRatingInput);
        setReviewInput(tempReviewInput);
        setIsEdit(false);
        editingHandler();
    }

    const onChange = event => {
        switch (event.target.name) {
            case "rating": return setRatingInput(event.target.value);
            case "review": return setReviewInput(event.target.value);
            default: return
        }
    }

    const submitEditedReview = async event => {
        event.preventDefault();
        const response = await fetch(`http://localhost:3001/user/review/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                review: reviewInput,
                rating: ratingInput
            })
        });
        const resData = await response.json();
        if (resData.error === 'not signed in') {
            const ok = window.confirm("You need to login first! Do you want to login?");
            if (ok) {
                dispatch(authActions.logout());
                history.push('/auth');
            }
        } else {
            reviewEdited(resData);
            setIsEdit(false);
            editingHandler();
            history.push(`/detail/${classId}`)
        }
    }

    const editReview = () => {
        setTempRatingInput(ratingInput);
        setTempReviewInput(reviewInput);
        editingHandler();
        setIsEdit(true);
    }

    const deleteReview = async () => {
        //async delete request
        const response = await fetch(`http://localhost:3001/user/review/${classId}/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const resData = await response.json();
        if (resData.error === 'not signed in') {
            const ok = window.confirm("You need to login first! Do you want to login?");
            if (ok) {
                dispatch(authActions.logout());
                history.push('/auth');
            }
        } else {
            reviewDeleted()
            history.push(`/detail/${classId}`)
        }
    }

    let reviewContent = <div>
        <p>Username: {username}</p>
        <p>Rating: {ratingInput}</p>
        <p>Review: {reviewInput}</p>
        <p>Date: {date}</p>
    </div>;
    if (isEdit) {
        reviewContent = <div><form onSubmit={(submitEditedReview)}>
            <label>Rating</label>
            <input type='number' value={ratingInput} name="rating" onChange={onChange} />
            <label>Review</label>
            <input type='text' value={reviewInput} name="review" onChange={onChange} />
            <input type='submit' value='edit' />
        </form>
            <button onClick={cancelEdit}>Go back</button>
        </div>
    }

    return (<>
        {reviewContent}
        {(isOwner && !isEdit) ? (<><button onClick={editReview}>Edit</button><button onClick={deleteReview}>Delete</button></>) : null}
    </>);
}

export default Review;