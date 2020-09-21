import { FETCH_CLASS } from "../actions/class-list"

const initialState = {
    allClasses: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CLASS:
            return {
                ...state,
                allClasses: action.fetchedClasses
            }
        default: return state;
    }
}