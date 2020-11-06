import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
// import { dbService } from '../../fbase';

import * as authActions from '../../store/actions/auth';

const Profile = props => {
    const [usernameInput, setUsernameInput] = useState('');
    const [tempUsername, setTempUsername] = useState(usernameInput);
    const [email, setEmail] = useState('');
    const [edit, setEdit] = useState(false);

    const dispatch = useDispatch();

    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3001/user/auth/user-data", {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const resData = await response.json();
            if (resData.error === "not signed in") {
                dispatch(authActions.logout());
            }
            else {
                setUsernameInput(resData.username);
                setEmail(resData.email);
            }
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData])

    const onChangeHandler = event => {
        setUsernameInput(event.target.value);
    }

    const editProfile = async (username) => {
        const response = await fetch("http://localhost:3001/user/auth/edit", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username
            })
        });
        if (response.status !== 200) {
            console.log('an error has occured');
        }
        const resData = await response.json()
        if (resData.error === "not signed in") {
            dispatch(authActions.logout());
        } else {
            setEdit(false);
        }
    }

    const onSubmitHandler = event => {
        event.preventDefault();
        if (usernameInput !== tempUsername) {
            const ok = window.confirm("Change username?");
            if (ok) {
                editProfile(usernameInput);
                // props.history.go(0);
                //maybe show flash
            } else {
                cancelEdit();
            }
        } else {
            setEdit(false);
        }
    }

    const editButton = () => {
        setTempUsername(usernameInput);
        setEdit(true);
    }

    const cancelEdit = () => {
        setUsernameInput(tempUsername);
        setEdit(false);
    }

    let editContent = <form onSubmit={onSubmitHandler}>
        <label>Username : </label>
        <input onChange={onChangeHandler} type='text' value={usernameInput} />
        <input type='submit' value="Change Username" />
    </form>

    let userInfo = (<>
        <p>User Email: {email}</p>
        <p>Username: {usernameInput}</p>
    </>)

    return (
        <>
            <p>This is User Profile page</p>
            {edit ? editContent : userInfo}
            {edit ? <button onClick={cancelEdit}>Go back</button>
                : <button onClick={editButton}>Edit</button>}
        </>
    )
}

export default Profile;