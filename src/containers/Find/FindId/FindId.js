import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FindId = () => {

    const [phoneNumberInput, setPhoneNumberInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [message, setMessage] = useState('');

    const onChange = event => {
        if (event.target.name === "phoneNumber") {
            setPhoneNumberInput(event.target.value);
        } else if (event.target.name === "name") {
            setUsernameInput(event.target.value);
        }
    }

    const onSubmit = async event => {
        event.preventDefault()
        const response = await fetch("http://localhost:3001/user/auth/find/id", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: usernameInput,
                phoneNumber: phoneNumberInput
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

    return (
        <>
            <form onSubmit={onSubmit}>
                <label>
                    Name
                <input type="text" placeholder="name" name="name" onChange={onChange} value={usernameInput} />
                </label>
                <label>
                    Phone Number
                <input type="number" placeholder="Phone Number" name="phoneNumber" onChange={onChange} value={phoneNumberInput} />
                </label>
                <input type="submit" value="Search" />
                {message}
            </form>
            <Link to="/auth">로그인으로 돌아가기</Link>
        </>
    )
};

export default FindId;
