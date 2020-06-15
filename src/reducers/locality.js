import initialState from "./initialState";

const locality = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.locality;
    }

    switch (action.type) {
        case 'SET_LOCALITY':
            return {
                ...state,
                ...payload
            };
        case 'SET_LOCALITY_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_LOCALITY':
            return initialState.locality;
        default:
            return state
    }
};

export default locality;