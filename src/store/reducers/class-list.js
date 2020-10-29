import { FETCH_CLASS, UPDATE_FOLLOWER } from "../actions/class-list"

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
        case UPDATE_FOLLOWER:
            const classIndex = state.allClasses.findIndex(cl => cl.id === action.classId);
            const updatedClasses = [...state.allClasses];
            if (action.add) {
                updatedClasses[classIndex].followers.push(action.userEmail);
            } else {
                updatedClasses[classIndex].followers.splice(action.userEmail, 1);
            }
            return {
                allClasses: updatedClasses
            }
        default: return state;
    }
}