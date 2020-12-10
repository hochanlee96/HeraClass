import React, { useState } from 'react';

const Input = () => {
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <>
            <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} />
        </>
    )
}

export default Input;