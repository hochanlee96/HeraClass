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
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
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
        console.log(resData);
        dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000))
        const expirationDate = new Date().getTime() + parseInt(resData.expiresIn) * 1000;
        localStorage.setItem('token', resData.idToken);
        localStorage.setItem('refreshToken', resData.refreshToken);
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
        localStorage.setItem('refreshToken', resData.refreshToken);
        localStorage.setItem('userId', resData.localId);
        localStorage.setItem('expiration', expirationDate);
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = localStorage.getItem('expiration');
            if (expirationDate < new Date().getTime()) {
                dispatch(logout());
            } else {
                //refresh()
                dispatch(refreshAuth(localStorage.getItem('refreshToken')));
                // const token = localStorage.getItem('token');
                // const userId = localStorage.getItem('userId');
                // localStorage.setItem('expiration', new Date().getTime() + 3600000);
                // dispatch(authenticate(token, userId));
            }
        }
    }
}
//refresh();
export const refreshAuth = refreshToken => {
    return async dispatch => {
        const response = await fetch("https://securetoken.googleapis.com/v1/token?key=AIzaSyAYs8Y1rgKGc-Nzxz3KuPY87hFlMqFYWAo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
        });

        if (!response.ok) {
            // const errorResData = await response.json();
            // const errorId = errorResData.error.message;
            let message = 'Something went wrong...';
            throw new Error(message);
        }

        const resData = await response.json();
        dispatch(authenticate(resData.id_token, resData.user_id, parseInt(resData.expires_in) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expires_in) * 1000);
        localStorage.setItem('token', resData.id_token);
        localStorage.setItem('refreshToken', resData.refresh_token);
        localStorage.setItem('userId', resData.user_id);
        localStorage.setItem('expiration', expirationDate);
    }
}