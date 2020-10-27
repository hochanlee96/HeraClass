// import { AUTHENTICATE, LOGOUT, FETCH_USER_DATA, CREATE_USER, UPDATE_FAVORITES } from '../actions/auth';

// const initialState = {
//     token: null,
//     userId: null,
//     userData: { username: '', favorites: [] }
// }

// export default (state = initialState, action) => {
//     switch (action.type) {
//         case AUTHENTICATE:
//             return {
//                 ...state,
//                 token: action.token,
//                 userId: action.userId
//             }
//         case CREATE_USER:
//             return {
//                 ...state,
//                 userData: { ...action.userData } // deep copy needed
//             }
//         case FETCH_USER_DATA:
//             const fetchedUserData = {
//                 username: action.userData.username, favorites: [...action.userData.favorites]
//             }
//             return {
//                 ...state,
//                 userData: fetchedUserData
//             }
//         case UPDATE_FAVORITES:
//             const updatedFavorites = [...state.userData.favorites];
//             if (action.delete) {
//                 updatedFavorites.splice(action.favorites, 1);
//             } else {
//                 updatedFavorites.push(action.favorites);
//             }
//             return {
//                 ...state,
//                 userData: { username: state.userData.username, favorites: updatedFavorites }
//             }
//         case LOGOUT:
//             return initialState;
//         // case SIGN_UP:
//         //     return {
//         //         token: action.token,
//         //         userId: action.userId
//         //     }
//         default: return state;
//     }
// }

import { AUTHENTICATE, LOGOUT, UPDATE_FAVORITES } from '../actions/auth';

const initialState = {
    username: '',
    favorites: [],
    expires: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                username: action.userData.username,
                favorites: [...action.userData.favorites]
            }
        case UPDATE_FAVORITES:
            const updatedFavorites = [...state.userData.favorites];
            if (action.delete) {
                updatedFavorites.splice(action.favorites, 1);
            } else {
                updatedFavorites.push(action.favorites);
            }
            return {
                ...state,
                userData: { username: state.userData.username, favorites: updatedFavorites }
            }
        case LOGOUT:
            return initialState;
        default: return state;
    }
}