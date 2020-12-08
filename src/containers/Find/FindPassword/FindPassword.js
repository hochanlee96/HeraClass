import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

const FindPassword = () => {

    const history = useHistory();

    const [message, setMessage] = useState('');

    const [emailMethod, setEmailMethod] = useState(true);
    const [emailInput, setEmailInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');

    const [enterVerification, setEnterVerification] = useState(false);
    const [verificationNumberInput, setVerificationNumberInput] = useState('');
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

    const onChange = event => {
        if (event.target.name === 'email') {
            setEmailInput(event.target.value);
        } else if (event.target.name === 'username') {
            setUsernameInput(event.target.value);
        } else if (event.target.name === 'verification') {
            setVerificationNumberInput(event.target.value);
        } else if (event.target.name === 'new-password') {
            setNewPasswordInput(event.target.value);
        } else if (event.target.name === 'confirm-password') {
            setConfirmPasswordInput(event.target.value);
        }
    }

    const submitEmailAndUsername = async event => {
        event.preventDefault();
        const response = await fetch("http://localhost:3001/user/auth/find/password/send-verification", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                emailMethod: emailMethod,
                email: emailInput,
                username: usernameInput
            })
        });
        const resData = await response.json();
        if ((resData.message || resData.statusName) === 'success') {
            setEnterVerification(true);
            setMessage(`${emailMethod ? "이메일" : "휴대폰으"}로 인증번호가 발송되었습니다`)
        } else if (resData.error === "doesn't exist") {
            setMessage('존재하지 않는 사용자입니다. 소셜로그인을 확인해보세요')
        } else {
            setMessage(resData.error)
        }
    }

    const resetPassword = async event => {
        event.preventDefault();
        const response = await fetch("http://localhost:3001/user/auth/find/password/reset-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                verificationNumber: verificationNumberInput,
                newPassword: newPasswordInput
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
                <input type="email" placeholder="이메일" name="email" onChange={onChange} value={emailInput} />
            </label>
            <label>
                이름
                <input type="text" placeholder="이름" name="username" onChange={onChange} value={usernameInput} />
            </label>
            <input type="submit" value="비밀번호 찾기" />
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
                    <input type="number" name="verification" placeholder="인증번호" onChange={onChange} value={verificationNumberInput} />
                    </label>
                    <label>
                        새 비밀번호
                    <input type="password" name="new-password" placeholder="새 비밀번호" onChange={onChange} value={newPasswordInput} />
                    </label>
                    <label>
                        비밀번호 확인
                    <input type="password" name="confirm-password" placeholder="비밀번호 확인" onChange={onChange} value={confirmPasswordInput} />
                    </label>
                    <input type="submit" value="비밀번호 재설정" />
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