import initialState from "./initialState";

const profile = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.profile;
    }

    switch (action.type) {
        case 'SET_PROFILE_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'SET_PROFILE':
            return {
                request: false,
                ...payload
            };
        default:
            return state
    }
};

export default profile;