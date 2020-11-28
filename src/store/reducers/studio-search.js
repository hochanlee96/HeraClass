import { FETCH_STUDIO, UPDATE_FOLLOWER } from "../actions/studio-search"

const initialState = {
    allStudios: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_STUDIO:
            return {
                ...state,
                allStudios: [...action.fetchedStudios]
            }
        case UPDATE_FOLLOWER:
            const studioIndex = state.allStudios.findIndex(studio => studio.id === action.studioId);
            const updatedStudios = [...state.allStudios];
            if (action.add) {
                updatedStudios[studioIndex].followers.push(action.userEmail);
            } else {
                updatedStudios[studioIndex].followers.splice(action.userEmail, 1);
            }
            return {
                allStudios: updatedStudios
            }
        default: return state;
    }
}