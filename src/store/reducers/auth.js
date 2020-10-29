import { AUTHENTICATE, LOGOUT, UPDATE_FAVORITES } from '../actions/auth';

const initialState = {
    email: '',
    username: '',
    favorites: [],
    expires: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                email: action.userData.email,
                username: action.userData.username,
                favorites: [...action.userData.favorites]
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