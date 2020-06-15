import initialState from "./initialState";

const kinds = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.kind;
    }

    switch (action.type) {
        case 'SET_KIND':
            return {
                ...state,
                ...payload
            };
        case 'SET_KIND_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_KIND':
            return initialState.kind;
        default:
            return state
    }
};

export default kinds;