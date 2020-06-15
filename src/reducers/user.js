import initialState from "./initialState";

const user = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.user;
    }

    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                ...payload
            };
        case 'SET_USER_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'ADD_USER_KIND':
            return {
                ...state,
                guardians_kinds: [...state.guardians_kinds, payload]
            };
        case 'SET_USER_KIND':
            return {
                ...state,
                guardians_kinds: [...payload]
            };
        case 'DELETE_USER_KIND':
            return {
                ...state,
                guardians_kinds: [...payload]
            };
        case 'CLEAR_USER':
            return initialState.user;
        default:
            return state
    }
};

export default user;