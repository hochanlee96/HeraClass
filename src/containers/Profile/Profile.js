import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { dbService } from '../../fbase';

const Profile = props => {
    const [usernameInput, setUsernameInput] = useState('');
    const userId = useSelector(state => state.auth.userId);

    useEffect(() => {
        if (userId) {
            dbService.collection('users').doc(`${userId}`).get().then(user => setUsernameInput(user.data().username));
        }
    }, [userId])

    const onChangeHandler = event => {
        setUsernameInput(event.target.value);
    }

    const onSubmitHandler = event => {
        event.preventDefault();
        const ok = window.confirm("Change password?");
        if (ok) {
            dbService.collection('users').doc(`${userId}`).update({
                username: usernameInput
            });
            props.history.replace('/profile');
            //maybe show flash
        }
    }

    return (
        <>
            <p>This is User Profile page</p>
            <form onSubmit={onSubmitHandler}>
                <label>Username : </label>
                <input onChange={onChangeHandler} type='text' value={usernameInput} />
                <input type='submit' value="Change Username" />
            </form>
        </>
    )
}

export default Profile;