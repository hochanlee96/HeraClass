import * as firebase from "firebase/app";
import { dbService } from '../../fbase';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const FETCH_USER_DATA = 'FETCH_USER_DATA';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';

let timer;

export const authenticate = (token, userId, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch(
            {
                type: AUTHENTICATE,
                token: token,
                userId: userId,
            }
        );
    }
}

export const logout = () => {
    clearLogoutTimer();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
    localStorage.removeItem('favorites');
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

        // const data = await authService.createUserWithEmailAndPassword(email, password);
        // console.log(data);

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
        // fetchUserData(resData.localId);
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

// 
export const fetchUserData = userId => {
    return async dispatch => {
        try {
            // const response = await fetch(`https://hercules-56a2b.firebaseio.com/users/${userId}.json`);
            // if (!response.ok) {
            //     throw new Error('Something went wrong!');
            // }

            // const resData = await response.json();
            // if (resData) {
            //     const fetchedFavorites = [];

            //     for (const key in resData.favorites) {
            //         fetchedFavorites.push(key)
            //     }

            const userRef = dbService.collection("users").doc(`${userId}`);
            userRef.get().then(user => {
                console.log(user.data());
                const fetchedUsername = user.data().username;
                const fetchedFavorites = [...user.data().favorites];
                localStorage.setItem('username', fetchedUsername);
                localStorage.setItem('favorites', fetchedFavorites);
                dispatch({ type: FETCH_USER_DATA, userData: { username: fetchedUsername, favorites: fetchedFavorites } });
            }
                ///


                ///
            );
        } catch (error) {
            throw error;
        }
    }
}



export const createUser = (userId, username) => {
    return async dispatch => {
        console.log('create User right before dispatch')
        // const response = await fetch(`https://hercules-56a2b.firebaseio.com/users/${userId}.json`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         username: username,
        //         favorites: null
        //     })
        // });

        // if (!response.ok) {
        //     let message = 'Something went wrong...';
        //     throw new Error(message);
        // }

        // const resData = await response.json();
        // console.log(resData);
        await dbService.collection("users").doc(`${userId}`).set({ username: username, favorites: {} });
        localStorage.setItem('username', username)
        dispatch({ type: CREATE_USER, userData: { username: username } })
    }
}

export const updateFavorites = (classId, userId, add) => {
    return async dispatch => {
        // let response;
        if (add) {
            dbService.collection('users').doc(`${userId}`).update({
                favorites: firebase.firestore.FieldValue.arrayUnion(classId)
            });
            dispatch({ type: UPDATE_FAVORITES, delete: false, favorites: classId })
            // response = await fetch(`https://hercules-56a2b.firebaseio.com/users/${userId}/favorites/${classId}.json`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         classId
            //     })
            // });
            // if (!response.ok) {
            //     const errorResData = await response.json();
            //     console.log(errorResData)
            //     let message = 'Something went wrong...';
            //     throw new Error(message);
            // }

            // const resData = await response.json();

        } else {
            dbService.collection('users').doc(`${userId}`).update({
                favorites: firebase.firestore.FieldValue.arrayRemove(classId)
            });
            // response = await fetch(`https://hercules-56a2b.firebaseio.com/users/${userId}/favorites/${classId}.json`, {
            //     method: 'DELETE',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
            // if (!response.ok) {
            //     const errorResData = await response.json();
            //     console.log(errorResData)
            //     let message = 'Something went wrong...';
            //     throw new Error(message);
            // }

            // const resData = await response.json();
            dispatch({ type: UPDATE_FAVORITES, delete: true, favorites: classId })
        }
    }
}