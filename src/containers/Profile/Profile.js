import React, { useState, useEffect, useCallback } from 'react';

// import { dbService } from '../../fbase';

const Profile = props => {
    const [usernameInput, setUsernameInput] = useState('');
    const [email, setEmail] = useState('');
    const [edit, setEdit] = useState(false);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3001/user-data", {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const resData = await response.json();
            setUsernameInput(resData.username);
            setEmail(resData.email);
        } catch (err) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData])

    const onChangeHandler = event => {
        setUsernameInput(event.target.value);
    }

    const editProfile = async (username) => {
        const response = await fetch("http://localhost:3001/edit", {
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
            console.log('error')
        }
    }

    const onSubmitHandler = event => {
        setEdit(false);
        event.preventDefault();
        const ok = window.confirm("Change username?");
        if (ok) {
            editProfile(usernameInput);
            props.history.go(0);
            //maybe show flash
        }
    }

    const editButton = () => {
        setEdit(true);
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
            {edit ? null : <button onClick={editButton}>Edit</button>}
        </>
    )
}

export default Profile;