import { AUTHENTICATE, LOGOUT, UPDATE_FAVORITES, SET_REDIRECT_PATH } from '../actions/auth';

const initialState = {
    email: '',
    verified: false,
    username: '',
    favorites: [],
    events: [],
    expires: null,
    redirect: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                email: action.userData.email,
                verified: action.userData.verified,
                username: action.userData.username,
                favorites: [...action.userData.favorites],
                events: [...action.userData.events]
            }
        case SET_REDIRECT_PATH:
            return {
                ...state,
                redirect: action.redirect_path
            }
        case UPDATE_FAVORITES:
            const updatedFavorites = [...state.favorites];
            if (action.delete) {
                updatedFavorites.splice(action.favorites, 1);
            } else {
                updatedFavorites.push(action.favorites);
            }
            return {
                ...state,
                favorites: updatedFavorites
            }
        case LOGOUT:
            return initialState;
        default: return state;
    }
}