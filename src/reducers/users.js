import initialState from "./initialState";

const users = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.users;
    }

    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                ...payload
            };
        case 'SET_USERS_SORT_TITLE':
            return {
                ...state,
                sortTitle: payload
            };
        case 'SET_USERS_OPTIONS_SORT':
            return {
                ...state,
                options: {
                    ...state.options,
                    sort: payload
                }
            };
        case 'SET_USERS_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'SET_USERS_OPTIONS_SEARCH':
            return {
                ...state,
                options: {
                    ...state.options,
                    q: payload
                }
            };
        case 'SET_USER_ACTIVE':
            return {
                ...state,
                data: [...payload]
            };
        case 'SET_USER_IS_BREEDER':
            return {
                ...state,
                data: [...payload]
            };
        case 'SET_USER_IS_GUARD':
            return {
                ...state,
                data: [...payload]
            };
        case 'DELETE_USER':
            return {
                ...state,
                data: payload
            };
        default:
            return state
    }
};

export default users;