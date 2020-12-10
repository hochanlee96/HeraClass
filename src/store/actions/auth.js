export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const FETCH_USER_DATA = 'FETCH_USER_DATA';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';
export const SET_REDIRECT_PATH = 'SET_REDIRECT_PATH';

let timer;

export const authenticate = (userData) => {
    return dispatch => {
        clearLogoutTimer();
        dispatch(setLogoutTimer(userData.expires));
        dispatch(
            {
                type: AUTHENTICATE,
                userData: userData
            }
        );
    }
}

export const logout = () => {
    return async dispatch => {
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/logout", {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (response.ok) {
            clearLogoutTimer();
            dispatch({ type: LOGOUT });
        }
    }
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expires => {
    return dispatch => {
        const now = new Date().getTime()
        const expireTime = new Date(expires).getTime()
        timer = setTimeout(() => {
            dispatch(logout());
        }, expireTime - now);
    }
}


export const register = (email, username, password, number) => {
    return async dispatch => {
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                phoneNumber: number
            })
        });

        const resData = await response.json();
        if (!resData.error) {
            dispatch(authenticate(resData));
        } else {
            throw new Error(resData.error);
        }
    }
}

export const login = (email, password) => {
    return async dispatch => {

        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + "/user/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        const resData = await response.json();
        if (!resData.error) {
            dispatch(authenticate(resData));
        } else {
            throw new Error(resData.error);
        }


    }
}

export const authCheckState = () => {
    return async dispatch => {
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + '/user/auth/user-data', {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const resData = await response.json();
        if (!resData.error) {
            dispatch(authenticate(resData));
        } else {
            dispatch(logout());
        }
    }
}

export const updateFavorites = (studioId, add) => {
    return async dispatch => {
        if (add) {
            const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + '/user/auth/update-favorites', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    studioId: studioId,
                    add: true
                })
            });
            if (!response.ok) {
                let message = 'Something went wrong...';
                throw new Error(message);
            }
            dispatch({ type: UPDATE_FAVORITES, delete: false, favorites: studioId })

        } else {

            const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + '/user/auth/update-favorites', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    studioId: studioId,
                    add: false
                })
            });
            if (!response.ok) {
                let message = 'Something went wrong...';
                throw new Error(message);
            }
            dispatch({ type: UPDATE_FAVORITES, delete: true, favorites: studioId })
        }
    }
}