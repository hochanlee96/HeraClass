import React, { useState, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import * as authActions from '../../../store/actions/auth';
import classes from './AuthForm.module.css';
import Input from '../../UI/Input/Input';
import { validate } from '../../../shared/helper';

const initialState = {
    email: {
        value: '',
        touched: false,
        validation: 'email',
        isValid: false,
        errorMessage: ''
    },
    password: {
        value: '',
        touched: false,
        validation: 'password',
        isValid: false,
        errorMessage: ''
    },
    username: {
        value: '',
        touched: false,
        validation: 'username',
        isValid: false,
        errorMessage: ''
    },
    phoneNumber: {
        value: '',
        touched: false,
        validation: 'phoneNumber',
        isValid: false,
        errorMessage: ''
    },
    verificationNumber: {
        value: '',
        touched: false,
        validation: 'verificationNumber',
        isValid: false,
        errorMessage: ''
    },
    confirmPassword: {
        value: '',
        touched: false,
        validation: 'confirmPassword',
        isValid: false,
        errorMessage: ''
    },
};

const reducer = (state, action) => {

    const { name, value } = action;
    let validation;
    switch (action.type) {
        case 'onChange':
            if (name === "confirmPassword") {
                validation = { ...validate(state[name].validation, value.trim(), state.password.value.trim()) }
            } else {
                validation = { ...validate(state[name].validation, value.trim()) };
            }
            return { ...state, [name]: { ...state[name], value: value, isValid: validation.isValid, errorMessage: validation.errorMessage } }
        case 'onFocus':
            return { ...state }
        case 'onBlur':
            return { ...state, [name]: { ...state[name], touched: true } }
        default:
            throw new Error();
    }
}

const AuthForm = () => {

    const [state, formDispatch] = useReducer(reducer, initialState);
    const [formIsSane, setFormIsSane] = useState(false);

    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationSentMessage, setVerificationSentMesage] = useState('');
    const [numberInUse, setNumberInUse] = useState(false);
    const [phoneNumberVerified, setPhoneNumberVerified] = useState(false);
    const [phoneNumberVerifiedMessage, setPhoneNumberVerifiedMessage] = useState('');
    const [isSignin, setIsSignin] = useState(true);
    const [error, setError] = useState();
    const redirect_path = useSelector(state => state.auth.redirect);
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        let valid = state.email.isValid && state.password.isValid;
        if (!isSignin) {
            valid = valid && state.username.isValid && state.phoneNumber.isValid && state.password.isValid && state.confirmPassword.isValid && phoneNumberVerified;
        }
        setFormIsSane(valid);
    }, [state, isSignin, phoneNumberVerified])

    const authToggler = () => {
        setIsSignin(prev => !prev)
    }

    const sendVerificationNumber = async () => {
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/verify-phone", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                phoneNumber: state.phoneNumber.value.trim()
            })
        });
        const resData = await response.json();
        if (resData.statusName === 'success') {
            setVerificationSentMesage("인증번호 발송됨")
            setVerificationSent(true)
        } else if (resData.error === 'exists') {
            setVerificationSentMesage("이미 사용중인 번호입니다")
            setNumberInUse(true);
        }
    }

    const checkVerification = async () => {
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/check-verification-number", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                verificationNumber: state.verificationNumber.value.trim()
            })
        });
        const resData = await response.json();
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
                await dispatch(authActions.login(state.email.value.trim(), state.password.value.trim()));
                history.push(redirect_path)
            } else {
                await dispatch(authActions.register(state.email.value.trim(), state.username.value.trim(), state.password.value.trim(), state.phoneNumber.value.trim()));
                history.push(redirect_path)
            }

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <p>{isSignin ? 'Log In' : 'Sign Up'}</p>
            <p>{error}</p>
            <form onSubmit={submitHandler}>
                <Input name="email" onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} className={classes.Input} type="email" placeholder="Email" value={state.email.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} touched={state.email.touched} errorMessage={state.email.errorMessage} />
                {!isSignin && <Input name="username" onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} className={classes.Input} type="text" placeholder="Username" value={state.username.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} touched={state.username.touched} errorMessage={state.username.errorMessage} />}
                {!isSignin && <Input name="phoneNumber" className={classes.Input} type="number" placeholder="phone number without -" value={state.phoneNumber.value} disabled={phoneNumberVerified} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.phoneNumber.touched} errorMessage={state.phoneNumber.errorMessage} />}
                {!isSignin && phoneNumberVerified ? <p>인증됨</p> : null}
                {!isSignin && !phoneNumberVerified ? numberInUse ? < button onClick={(event) => { event.preventDefault(); sendVerificationNumber() }}>재전송</button> : verificationSent ? < button disabled={!state.phoneNumber.isValid} onClick={(event) => { event.preventDefault(); sendVerificationNumber() }}>재전송</button> : < button disabled={!state.phoneNumber.isValid} onClick={(event) => { event.preventDefault(); sendVerificationNumber() }}>인증번호 발송</button> : null}
                {!isSignin && !phoneNumberVerified && (verificationSent || numberInUse) && <p>{verificationSentMessage}</p>}
                {!isSignin && !phoneNumberVerified && verificationSent && <Input name="verificationNumber" type="number" placeholder="verification" value={state.verificationNumber.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.verificationNumber.touched} errorMessage={state.verificationNumber.errorMessage} />}
                {!isSignin && !phoneNumberVerified && verificationSent && <button onClick={(event) => { event.preventDefault(); checkVerification() }}>확인</button>}
                {!isSignin && !phoneNumberVerified && verificationSent && <p>{phoneNumberVerifiedMessage}</p>}
                <Input name="password" className={classes.Input} type="password" placeholder="password" value={state.password.value} onChange={(event) => formDispatch({ type: 'onChange', name: "password", value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.password.touched} errorMessage={state.password.errorMessage} />
                {!isSignin && <Input name="confirmPassword" className={classes.Input} type="password" placeholder="confirm password" value={state.confirmPassword.value} onChange={(event) => formDispatch({ type: 'onChange', name: "confirmPassword", value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.confirmPassword.touched} errorMessage={state.confirmPassword.errorMessage} />}
                <button disabled={!formIsSane} className={classes.Button} onClick={submitHandler}>{isSignin ? 'Log In' : 'Register'}</button>
            </form>
            <button onClick={authToggler}>Switch to {isSignin ? "Sign Up" : "Log In"}</button>
            {isSignin ? <> <a href={process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/google"}>Login with Google</a> <a href={process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/facebook"}>Login with Facebook</a></> : null}
            <div>
                <Link to="/find/id">Find Email</Link>
                <Link to="/find/password">Find Password</Link>
            </div>
        </>
    )
}

export default AuthForm;