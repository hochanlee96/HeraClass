import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { dbService } from '../../fbase';

import * as authActions from '../../store/actions/auth';

const Profile = props => {
    const [usernameInput, setUsernameInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState('');
    const [tempUsername, setTempUsername] = useState(usernameInput);
    const [email, setEmail] = useState('');
    const [edit, setEdit] = useState(false);
    const [checking, setChecking] = useState(false);
    const [timer, setTimer] = useState(null);

    const dispatch = useDispatch();
    const history = useHistory();

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
                setIsVerified(resData.verified);
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
                history.go(0);
                setEdit(false);
            } else {
                cancelEdit();
            }
        } else {
            const ok = window.confirm("there's nothing to change...keep editting?");
            if (!ok) {
                setEdit(false);
            }
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

    const verifyEmail = async () => {
        const response = await fetch("http://localhost:3001/user/auth/verify", {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const resData = await response.json()
        if (resData.error === "not signed in") {
            dispatch(authActions.logout());
        } else {
            console.log(resData.message);
            setMessage(resData.message);

        }
    }

    const check = useCallback(async () => {
        const response = await fetch('http://localhost:3001/user/auth/check-verification', {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        const resData = await response.json();
        console.log(resData);
        if (resData.verified) {
            setIsVerified(true)
            setMessage(null);
        }
    }, [])

    useEffect(() => {
        if (message && !isVerified && !checking) {
            setTimer(setTimeout(() => {
                console.log('checking')
                setChecking(true);
                check().then(setChecking(false))
            }, 3000))
        }
    }, [message, isVerified, checking, check])


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
            {isVerified ? <p>You are verified!</p> : <p>You are not verified yet!</p>}
            {isVerified ? null : <button onClick={verifyEmail}>Verify now</button>}
            <p>{message}</p>
        </>
    )
}

export default Profile;