import React, { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';

import Input from '../../../components/UI/Input/Input';
import { validate } from '../../../shared/helper';

const initialState = {
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
    }
};

const reducer = (state, action) => {
    const { name, value } = action;
    let validation;
    switch (action.type) {
        case 'onChange':
            validation = { ...validate(state[name].validation, value.trim()) };
            return { ...state, [name]: { ...state[name], value: value, isValid: validation.isValid, errorMessage: validation.errorMessage } }
        case 'onFocus':
            return { ...state }
        case 'onBlur':
            return { ...state, [name]: { ...state[name], touched: true } }
        default:
            throw new Error();
    }
}


const FindId = () => {

    const [state, formDispatch] = useReducer(reducer, initialState);
    const [message, setMessage] = useState('');
    const [formIsValid, setFormIsValid] = useState(false);


    const onSubmit = async event => {
        event.preventDefault()
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/find/id", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: state.username.value,
                phoneNumber: state.phoneNumber.value
            })
        });
        const resData = await response.json();
        if (resData.statusName === 'success') {
            setMessage('Check your message')
        } else if (resData.error === "doesn't exist") {
            setMessage('존재하지 않는 사용자입니다. 소셜로그인을 확인해보세요')
        } else {
            setMessage(resData.error)
        }
    }

    useEffect(() => {
        setFormIsValid(state.username.isValid && state.phoneNumber.isValid)
    }, [state])

    return (
        <>
            <form onSubmit={onSubmit}>
                <label>
                    Name
                    <Input name="username" onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} type="text" placeholder="Username" value={state.username.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} touched={state.username.touched} errorMessage={state.username.errorMessage} />
                </label>
                <label>
                    Phone Number
                    <Input name="phoneNumber" type="number" placeholder="phone number without -" value={state.phoneNumber.value} onChange={(event) => formDispatch({ type: 'onChange', name: event.target.name, value: event.target.value })} onBlur={(event) => { formDispatch({ type: 'onBlur', name: event.target.name }) }} onFocus={(event) => formDispatch({ type: 'onFocus', name: event.target.name })} touched={state.phoneNumber.touched} errorMessage={state.phoneNumber.errorMessage} />
                </label>
                <input type="submit" value="Search" disabled={!formIsValid} />
                {message}
            </form>
            <Link to="/auth">로그인으로 돌아가기</Link>
        </>
    )
};

export default FindId;
