import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import * as authActions from '../../../store/actions/auth';

const Review = ({ editingHandler, reviewEdited, reviewDeleted, reviewId, username, rating, review, date, isOwner }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const studioId = match.params.studioId;

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
        const updatedReview = {};
        if ((reviewInput !== tempReviewInput) || (ratingInput !== tempRatingInput)) {
            if (reviewInput !== tempReviewInput) {
                updatedReview.review = reviewInput
            }
            if (ratingInput !== tempRatingInput) {
                updatedReview.rating = ratingInput
            }
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/review/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedReview)
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
                history.push(`/detail/${studioId}`)
            }
        }
        else {
            cancelEdit();
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
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/review/${studioId}/${reviewId}`, {
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
            history.push(`/detail/${studioId}`)
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