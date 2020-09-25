import { AUTHENTICATE, LOGOUT, FETCH_USER_DATA, CREATE_USER } from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    userData: { username: '' },
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                token: action.token,
                userId: action.userId
            }
        case CREATE_USER:
            return {
                ...state,
                userData: { ...action.userData } // deep copy needed
            }
        case FETCH_USER_DATA:
            const fetchedUserData = { username: action.userData.username }
            return {
                ...state,
                userData: fetchedUserData
            }
        case LOGOUT:
            return initialState;
        // case SIGN_UP:
        //     return {
        //         token: action.token,
        //         userId: action.userId
        //     }
        default: return state;
    }
}