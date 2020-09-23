// export const SIGN_UP = 'SIGN_UP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (token, userId, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch(
            {
                type: AUTHENTICATE,
                token: token,
                userId: userId
            }
        );
    }
}

export const logout = () => {
    clearLogoutTimer();
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expiration')
    return {
        type: LOGOUT
    }
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
}

export const register = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAYs8Y1rgKGc-Nzxz3KuPY87hFlMqFYWAo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong...';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!'
            }
            throw new Error(message);
        }

        const resData = await response.json();
        dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000))
        const expirationDate = new Date().getTime() + parseInt(resData.expiresIn) * 1000;
        localStorage.setItem('token', resData.idToken);
        localStorage.setItem('userId', resData.localId);
        localStorage.setItem('expiration', expirationDate);
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAYs8Y1rgKGc-Nzxz3KuPY87hFlMqFYWAo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong...';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!'
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!'
            }
            throw new Error(message);
        }

        const resData = await response.json();
        dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        localStorage.setItem('token', resData.idToken);
        localStorage.setItem('userId', resData.localId);
        localStorage.setItem('expiration', expirationDate);
    }
}