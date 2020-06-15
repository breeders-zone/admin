import initialState from "./initialState";

const kinds = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.levels;
    }

    switch (action.type) {
        case 'SET_LEVELS':
            return {
                ...state,
                ...payload
            };
        case 'SET_LEVELS_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'DELETE_LEVEL':
            return {
                ...state,
                data: [...payload]
            };
        default:
            return state
    }
};

export default kinds;