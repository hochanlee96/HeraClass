// import * as firebase from "firebase/app";
// import { dbService } from '../../fbase';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const FETCH_USER_DATA = 'FETCH_USER_DATA';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';

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
        const response = await fetch("http://localhost:3001/logout", {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const resData = await response.json()
        console.log(resData);
        clearLogoutTimer();
        dispatch({ type: LOGOUT });

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


export const register = (email, username, password) => {
    return async dispatch => {
        const response = await fetch("http://localhost:3001/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
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
        dispatch(authenticate(resData))
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch("http://localhost:3001/login", {
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
        dispatch(authenticate(resData));

    }
}

export const authCheckState = () => {
    return async dispatch => {
        const response = await fetch("http://localhost:3001/user-data", {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        console.log('authcheckstate')
        const resData = await response.json();
        console.log('resdata', resData);
        if (resData) {
            console.log('loggd in')
            dispatch(authenticate(resData));
        } else {
            console.log('session expired');
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

export const updateFavorites = (classId, add) => {
    return async dispatch => {
        // let response;
        if (add) {
            //firebase 이용시
            // dbService.collection('users').doc(`${userId}`).update({
            //     favorites: firebase.firestore.FieldValue.arrayUnion(classId)
            // });
            const response = await fetch('http://localhost:3001/update-favorites', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    classId: classId,
                    add: true
                })
            });
            // const resData = await response;
            // console.log(resData);

            // response = await fetch(`https://hercules-56a2b.firebaseio.com/users/${userId}/favorites/${classId}.json`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         classId
            //     })
            // });
            if (!response.ok) {
                const errorResData = await response.json();
                console.log(errorResData)
                let message = 'Something went wrong...';
                throw new Error(message);
            }
            dispatch({ type: UPDATE_FAVORITES, delete: false, favorites: classId })

            // const resData = await response.json();

        } else {

            const response = await fetch('http://localhost:3001/update-favorites', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    classId: classId,
                    add: false
                })
            });
            //firebase 사용
            // dbService.collection('users').doc(`${userId}`).update({
            //     favorites: firebase.firestore.FieldValue.arrayRemove(classId)
            // });
            // response = await fetch(`https://hercules-56a2b.firebaseio.com/users/${userId}/favorites/${classId}.json`, {
            //     method: 'DELETE',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
            if (!response.ok) {
                const errorResData = await response.json();
                console.log(errorResData)
                let message = 'Something went wrong...';
                throw new Error(message);
            }

            // const resData = await response.json();
            dispatch({ type: UPDATE_FAVORITES, delete: true, favorites: classId })
        }
    }
}