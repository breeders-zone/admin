import initialState from "./initialState";

const trait = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.trait;
    }

    switch (action.type) {
        case 'SET_TRAIT':
            return {
                ...state,
                ...payload
            };
        case 'SET_TRAIT_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_TRAIT':
            return initialState.trait;
        default:
            return state
    }
};

export default trait;