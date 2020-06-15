import initialState from "./initialState";

const kinds = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.localities;
    }

    switch (action.type) {
        case 'SET_LOCALITIES':
            return {
                all: payload,
                request: false
            };
        case 'DELETE_LOCALITY':
            return {
                ...state,
                all: [...payload]
            };
        default:
            return state
    }
};

export default kinds;