import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import * as authActions from '../../../store/actions/auth';
import classes from './AuthForm.module.css';

const AuthForm = () => {
    const [emailInput, setEmailInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [phoneNumberInput, setPhoneNumberInput] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationSentMessage, setVerificationSentMesage] = useState('');
    const [numberInUse, setNumberInUse] = useState(false);
    const [phoneNumberVerified, setPhoneNumberVerified] = useState(false);
    const [verificationNumber, setVerificationNumber] = useState('');
    const [phoneNumberVerifiedMessage, setPhoneNumberVerifiedMessage] = useState('');
    const [isSignin, setIsSignin] = useState(true);
    const [error, setError] = useState();
    const redirect_path = useSelector(state => state.auth.redirect);
    const dispatch = useDispatch();
    const history = useHistory();

    const inputChangeHandler = (identifier, event) => {
        if (identifier === 'email') {
            setEmailInput(event.target.value);
        } else if (identifier === 'username') {
            setUsernameInput(event.target.value);
        } else if (identifier === 'password') {
            setPasswordInput(event.target.value);
        } else if (identifier === 'confirm-password') {
            setConfirmPasswordInput(event.target.value);
        } else if (identifier === 'phoneNumber') {
            setPhoneNumberInput(event.target.value);
        } else if (identifier === 'verification') {
            setVerificationNumber(event.target.value);
        }
    }

    const authToggler = () => {
        setIsSignin(prev => !prev)
    }

    const sendVerificationNumber = async () => {
        //async
        const response = await fetch("http://localhost:3001/user/auth/verify-phone", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                phoneNumber: phoneNumberInput
            })
        });
        const resData = await response.json();
        console.log(resData);
        if (resData.statusName === 'success') {
            // setVerificationSent(false);
            setVerificationSentMesage("인증번호 발송됨")
            setVerificationSent(true)
        } else if (resData.error === 'exists') {
            setVerificationSentMesage("이미 사용중인 번호입니다")
            setNumberInUse(true);
        }
    }

    const checkVerification = async () => {
        const response = await fetch("http://localhost:3001/user/auth/check-verification-number", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                verificationNumber: verificationNumber
            })
        });
        const resData = await response.json();
        console.log(resData);
        if (resData.message === 'success') {
            setPhoneNumberVerified(true);
        } else {
            setPhoneNumberVerifiedMessage("Incorrect")
        }
    }

    const submitHandler = async event => {
        event.preventDefault();
        try {
            if (isSignin) {
                await dispatch(authActions.login(emailInput, passwordInput));
                history.push(redirect_path)
            } else {
                if (phoneNumberVerified) {
                    await dispatch(authActions.register(emailInput, usernameInput, passwordInput, phoneNumberInput));
                    history.push(redirect_path)
                } else {
                    setError('please verify your phone number')
                }
            }

        } catch (err) {
            console.log('error occured here!', err)
            setError(err.message);
        }
    }

    return (
        <>
            <p>{isSignin ? 'Log In' : 'Sign Up'}</p>
            <p>{error}</p>
            <form onSubmit={submitHandler}>
                <input className={classes.Input} type="email" placeholder="Email" value={emailInput} onChange={(event) => inputChangeHandler('email', event)} />
                {!isSignin && <input className={classes.Input} type="text" placeholder="Username" value={usernameInput} onChange={(event) => inputChangeHandler('username', event)} />}
                {!isSignin && <input className={classes.Input} type="number" placeholder="phone number without -" value={phoneNumberInput} onChange={(event) => inputChangeHandler('phoneNumber', event)} />}
                {!isSignin && phoneNumberVerified ? <p>인증됨</p> : null}
                {!isSignin && !phoneNumberVerified ? numberInUse ? < button onClick={(event) => { event.preventDefault(); sendVerificationNumber() }}>재전송</button> : verificationSent ? < button onClick={(event) => { event.preventDefault(); sendVerificationNumber() }}>재전송</button> : < button onClick={(event) => { event.preventDefault(); sendVerificationNumber() }}>인증번호 발송</button> : null}
                {!isSignin && !phoneNumberVerified && (verificationSent || numberInUse) && <p>{verificationSentMessage}</p>}
                {!isSignin && !phoneNumberVerified && verificationSent && <input type="number" placeholder="verification" value={verificationNumber} onChange={(event) => inputChangeHandler('verification', event)} />}
                {!isSignin && !phoneNumberVerified && verificationSent && <button onClick={(event) => { event.preventDefault(); checkVerification() }}>확인</button>}
                {!isSignin && !phoneNumberVerified && verificationSent && <p>{phoneNumberVerifiedMessage}</p>}
                <input className={classes.Input} type="password" placeholder="password" value={passwordInput} onChange={(event) => inputChangeHandler('password', event)} />
                {!isSignin && <input className={classes.Input} type="password" placeholder="confirm password" value={confirmPasswordInput} onChange={(event) => inputChangeHandler('confirm-password', event)} />}
                <button className={classes.Button} onClick={submitHandler}>{isSignin ? 'Log In' : 'Register'}</button>
            </form>
            <button onClick={authToggler}>Switch to {isSignin ? "Sign Up" : "Log In"}</button>
            {isSignin ? <> <a href={"http://localhost:3001/user/auth/google"}>Login with Google</a> <a href={"http://localhost:3001/user/auth/facebook"}>Login with Facebook</a></> : null}
            <div>
                <Link to="/find/id">Find Email</Link>
                <Link to="/find/password">Find Password</Link>
            </div>
        </>
    )
}

export default AuthForm;