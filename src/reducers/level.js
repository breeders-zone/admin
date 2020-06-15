import initialState from "./initialState";

const level = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.level;
    }

    switch (action.type) {
        case 'SET_LEVEL':
            return {
                ...state,
                ...payload
            };
        case 'SET_LEVEL_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_LEVEL':
            return initialState.level;
        default:
            return state
    }
};

export default level;