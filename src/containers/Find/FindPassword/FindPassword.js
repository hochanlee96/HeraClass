import React, { useState, useEffect, useReducer } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Input from '../../../components/UI/Input/Input';
import { validate } from '../../../shared/helper';

const initialState = {
    email: {
        value: '',
        touched: false,
        validation: 'email',
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
    },
    username: {
        value: '',
        touched: false,
        validation: 'username',
        isValid: false,
        errorMessage: ''
    },
    verificationNumber: {
        value: '',
        touched: false,
        validation: 'verificationNumber',
        isValid: false,
        errorMessage: ''
    }
};

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
        default:
            throw new Error();
    }
}

const FindPassword = () => {

    const history = useHistory();

    const [state, formDispatch] = useReducer(reducer, initialState);
    const [formIsSane, setFormIsSane] = useState(false);

    const [message, setMessage] = useState('');

    const [emailMethod, setEmailMethod] = useState(true);
    const [enterVerification, setEnterVerification] = useState(false);

    useEffect(() => {
        if (enterVerification) {
            setFormIsSane(state.verificationNumber.isValid && state.newPassword.isValid && state.confirmPassword.isValid)
        } else {
            setFormIsSane(state.email.isValid && state.username.isValid)
        }
    }, [state, enterVerification])

    const submitEmailAndUsername = async event => {
        event.preventDefault();
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/find/password/send-verification", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                emailMethod: emailMethod,
                email: state.email.value,
                username: state.username.value
            })
        });
        const resData = await response.json();
        if ((resData.message || resData.statusName) === 'success') {
            setEnterVerification(true);
            setFormIsSane(false);
            setMessage(`${emailMethod ? "이메일" : "휴대폰으"}로 인증번호가 발송되었습니다`)
        } else if (resData.error === "doesn't exist") {
            setMessage('존재하지 않는 사용자입니다. 소셜로그인을 확인해보세요')
        } else {
            setMessage(resData.error)
        }
    }

    const resetPassword = async event => {
        event.preventDefault();
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/find/password/reset-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                verificationNumber: state.verificationNumber.value,
                newPassword: state.newPassword.value
            })
        });
        const resData = await response.json();
        if (resData.message === 'success') {
            window.alert('비밀번호가 변경되었습니다')
            history.push('/auth');
        } else if (resData.error) {
            setMessage(resData.error)
        }
    }

    const setMethod = identifier => {
        if (identifier === 'email') {
            setEmailMethod(true);
        } else {
            setEmailMethod(false);
        }
    }

    let initialForm = (
        <form onSubmit={submitEmailAndUsername}>
            <label>
                이메일
                <Input name="email" onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} type="email" placeholder="Email" value={state.email.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} touched={state.email.touched} errorMessage={state.email.errorMessage} />
            </label>
            <label>
                이름
                <Input name="username" onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} type="text" placeholder="Username" value={state.username.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} touched={state.username.touched} errorMessage={state.username.errorMessage} />
            </label>
            <input type="submit" value="비밀번호 찾기" disabled={!formIsSane} />
        </form>
    )

    const emailMethodButton = (<p style={emailMethod ? { backgroundColor: 'orange' } : null} onClick={() => setMethod('email')}>이메일로 찾기</p>)

    const phoneMethodButton = (
        <p style={!emailMethod ? { backgroundColor: 'orange' } : null} onClick={() => setMethod('phone')}>휴대폰으로 찾기</p>
    )
    if (enterVerification) {
        initialForm = (
            <>
                <form onSubmit={resetPassword}>
                    <label>
                        인증번호
                        <Input name="verificationNumber" type="number" placeholder="verification" value={state.verificationNumber.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.verificationNumber.touched} errorMessage={state.verificationNumber.errorMessage} />
                    </label>
                    <label>
                        새 비밀번호
                        <Input name="newPassword" type="password" placeholder="Newe Password" value={state.newPassword.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.password.touched} errorMessage={state.password.errorMessage} />
                    </label>
                    <label>
                        비밀번호 확인
                        <Input name="confirmPassword" type="password" placeholder="confirm password" value={state.confirmPassword.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.confirmPassword.touched} errorMessage={state.confirmPassword.errorMessage} />
                    </label>
                    <input type="submit" value="비밀번호 재설정" disabled={!formIsSane} />
                </form>
            </>
        )
    }

    return (
        <>
            {message}
            {enterVerification ? null : emailMethodButton}
            {emailMethod ? initialForm : null}
            {enterVerification ? null : phoneMethodButton}
            {!emailMethod ? initialForm : null}
            <Link to="/auth">로그인으로 돌아가기</Link>
        </>
    )
};

export default FindPassword;