import initialState from "./initialState";

const traits = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.traits;
    }

    switch (action.type) {
        case 'SET_TRAITS':
            return {
                ...state,
                data: payload,
                request: false
            };
        case 'SET_TRAITS_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'DELETE_TRAIT':
            return {
                ...state,
                data: [...payload]
            };
        default:
            return state
    }
};

export default traits;