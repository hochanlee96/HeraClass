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
// export const refreshAuth = refreshToken => {
//     return async dispatch => {
//         const response = await fetch("https://securetoken.googleapis.com/v1/token?key=AIzaSyAYs8Y1rgKGc-Nzxz3KuPY87hFlMqFYWAo", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 grant_type: "refresh_token",
//                 refresh_token: refreshToken
//             })
//         });

//         if (!response.ok) {
//             let message = 'Something went wrong...';
//             throw new Error(message);
//         }

//         const resData = await response.json();
//         dispatch(authenticate(resData.id_token, resData.user_id, parseInt(resData.expires_in) * 1000));
//         const expirationDate = new Date(new Date().getTime() + parseInt(resData.expires_in) * 1000);
//         localStorage.setItem('token', resData.id_token);
//         localStorage.setItem('refreshToken', resData.refresh_token);
//         localStorage.setItem('userId', resData.user_id);
//         localStorage.setItem('expiration', expirationDate);
//     }
// }

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
                const errorResData = await response.json();
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
                const errorResData = await response.json();
                let message = 'Something went wrong...';
                throw new Error(message);
            }
            dispatch({ type: UPDATE_FAVORITES, delete: true, favorites: studioId })
        }
    }
}