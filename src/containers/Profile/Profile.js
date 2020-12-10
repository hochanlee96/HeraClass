import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { dbService } from '../../fbase';

import * as authActions from '../../store/actions/auth';
import Input from '../../components/UI/Input/Input';
import { validate } from '../../shared/helper';

const initialState = {
    username: {
        value: '',
        touched: false,
        validation: 'username',
        isValid: false,
        errorMessage: ''
    },
    currentPassword: {
        value: '',
        touched: false,
        validation: 'password',
        isValid: false,
        errorMessage: ''
    },
    newPassword: {
        value: '',
        touched: false,
        validation: 'password',
        isValid: false,
        errorMessage: ''
    },
    confirmPassword: {
        value: '',
        touched: false,
        validation: 'confirmPassword',
        isValid: false,
        errorMessage: ''
    }
}

const reducer = (state, action) => {

    const { name, value } = action;
    let validation;
    switch (action.type) {
        case 'onChange':
            if (name === "confirmPassword") {
                validation = { ...validate(state[name].validation, value.trim(), state.newPassword.value.trim()) }
            } else {
                validation = { ...validate(state[name].validation, value.trim()) };
            }
            return { ...state, [name]: { ...state[name], value: value, isValid: validation.isValid, errorMessage: validation.errorMessage } }
        case 'onFocus':
            return { ...state }
        case 'onBlur':
            return { ...state, [name]: { ...state[name], touched: true } }
        case 'setUsername':
            return { ...state, username: { ...state.username, value: action.username } }
        default:
            throw new Error();
    }
}

const Profile = () => {

    const [state, formDispatch] = useReducer(reducer, initialState);
    const [email, setEmail] = useState('');
    const isVerified = useSelector(state => state.auth.verified);
    const isSocial = useSelector(state => state.auth.social);

    // const [usernameInput, setUsernameInput] = useState('');
    const [message, setMessage] = useState('');
    const [tempUsername, setTempUsername] = useState(state.username.value);
    const [edit, setEdit] = useState(false);
    const [checking, setChecking] = useState(false);
    const [reset, setReset] = useState(false);
    // const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    // const [newPasswordInput, setNewPasswordInput] = useState('');
    // const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
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
                formDispatch({ type: 'setUsername', username: resData.username })
                // setUsernameInput(resData.username);
                setEmail(resData.email);
            }
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData])

    // const onChangeHandler = event => {
    //     setUsernameInput(event.target.value);
    // }

    // const onPasswordInputChanged = event => {
    //     if (event.target.name === "current") {
    //         setCurrentPasswordInput(event.target.value);
    //     } else if (event.target.name === "new") {
    //         setNewPasswordInput(event.target.value);
    //     } else {
    //         setConfirmPasswordInput(event.target.value);
    //     }
    // }

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
        if (state.username.value !== tempUsername) {
            const ok = window.confirm("Change username?");
            if (ok) {
                editProfile(state.username.value);
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
        setTempUsername(state.username.value);
        setEdit(true);
    }

    const cancelEdit = () => {
        // setUsernameInput(tempUsername);
        formDispatch({ type: 'setUsername', username: tempUsername })
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
            history.go(0);
        }
    }, [history])

    const resetPassword = async event => {
        event.preventDefault();
        if (state.newPassword.value !== state.confirmPassword.value) {
            setPasswordError("The passwords do not match")
        } else {
            const response = await fetch("http://localhost:3001/user/auth/password-reset", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: email,
                    password: state.currentPassword.value,
                    newPassword: state.newPassword.value,
                })
            });
            const resData = await response.json();
            console.log(resData)
            if (resData.message === "success") {
                window.alert("비밀번호가 성공적으로 변경되었습니다")
                history.go(0);
            } else {
                setPasswordError(resData.error);
            }
        }
    }

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
        {/* <Input type='text' name="username" value={usernameInput} onChange={onChangeHandler} /> */}
        <Input type="text" placeholder="Username" name="username" onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} value={state.username.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} touched={state.username.touched} errorMessage={state.username.errorMessage} />
        <input type='submit' value="Change Username" />
    </form>

    let userInfo = (<>
        <p>User Email: {email}</p>
        <p>Username: {state.username.value}</p>
    </>)

    let passwordResetForm;
    if (reset) {
        passwordResetForm = (
            <form onSubmit={resetPassword}>
                <label> Current Password
                {/* <input type="password" placeholder="Current Password" name="current" onChange={onPasswordInputChanged} value={currentPasswordInput} /> */}
                    <Input name="currentPassword" type="password" placeholder="Current Password" value={state.currentPassword.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.currentPassword.touched} errorMessage={state.currentPassword.errorMessage} />
                </label>
                <label> New Password
                {/* <input type="password" placeholder="New Password" name="new" onChange={onPasswordInputChanged} value={newPasswordInput} /> */}
                    <Input name="newPassword" type="password" placeholder="New Password" value={state.newPassword.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.newPassword.touched} errorMessage={state.newPassword.errorMessage} />
                </label>
                <label> Confirm Password
                {/* <input type="password" placeholder="Confirm Password" name="confirm" onChange={onPasswordInputChanged} value={confirmPasswordInput} /> */}
                    <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={state.confirmPassword.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.confirmPassword.touched} errorMessage={state.confirmPassword.errorMessage} />
                </label>
                <input type="submit" value="Reset" />
            </form>
        )
    }

    return (
        <>
            <p>This is User Profile page</p>
            {edit ? editContent : userInfo}
            {edit ? <button onClick={cancelEdit}>Go back</button>
                : <button onClick={editButton}>Edit</button>}
            {!isSocial ? <p>Reset password</p> : <p>You logged in using social account!</p>}
            {passwordError ? passwordError : null}
            {!isSocial ? reset ? passwordResetForm : null : null}
            {!isSocial ? !reset ? <button onClick={() => setReset(true)}>Reset</button> : <button onClick={() => setReset(false)}>Cancel</button> : null}
            {isVerified ? <p>You are verified!</p> : <p>You are not verified yet!</p>}
            {isVerified ? null : <button onClick={verifyEmail}>Verify now</button>}
            <p>{message}</p>
        </>
    )
}

export default Profile;