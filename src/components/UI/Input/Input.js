import React from 'react';

const Input = ({ type, placeholder, name, value, onChange, onFocus, onBlur, disabled, touched, errorMessage }) => {

    return (
        <div>
            <input type={type} placeholder={placeholder} name={name} value={value} disabled={disabled} onChange={(event) => onChange(event)} onFocus={event => onFocus(event)} onBlur={event => onBlur(event)} />
            <p>{touched && errorMessage}</p>
        </div>
    )
}

export default Input;