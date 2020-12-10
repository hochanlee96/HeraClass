import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import * as authActions from '../../../store/actions/auth';

const NewReview = ({ studioId }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const [ratingInput, setRatingInput] = useState("");
    const [reviewInput, setReviewInput] = useState("");

    const onChange = event => {
        switch (event.target.name) {
            case "rating":
                return setRatingInput(event.target.value);
            case "review":
                return setReviewInput(event.target.value);
            default:
                return
        }
    }

    const onSubmit = async event => {
        event.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/review/${studioId}`, {
            method: 'POST',
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
                // dispatch(authActions.logout());
                dispatch({ type: authActions.SET_REDIRECT_PATH, redirect_path: match.url })
                history.push('/auth');
            }
        } else {
            //this has to be refreshed
            setReviewInput('');
            setRatingInput('');
            // history.push(`/detail/${studioId}`);
            history.go(0);
        }
    }
    return (<>
        <form onSubmit={onSubmit}>
            <label>Rating</label>
            <input type='number' placeholder="rating" value={ratingInput} name="rating" onChange={onChange} />
            <label>Review</label>
            <input type='text' placeholder='write a review' value={reviewInput} name='review' onChange={onChange} />
            <input type='submit' value="submit" />
        </form>
    </>);
}

export default NewReview;