import initialState from "./initialState";

const header = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.header;
    }

    switch (action.type) {
        case 'SET_HEADER_NEW_USERS':
            return {
                ...state,
                newUsers: {
                    ...state.newUsers,
                    ...payload
                }
            };
        case 'SET_HEADER_NEW_USERS_REQUEST':
            return {
                ...state,
                newUsers: {
                    ...state.newUsers,
                    request: payload
                }
            };
        case 'SET_HEADER_NEW_PRODUCTS':
            return {
                ...state,
                newProducts: {
                    ...state.newProducts,
                    ...payload
                }
            };
        case 'SET_HEADER_NEW_PRODUCTS_REQUEST':
            return {
                ...state,
                newProducts: {
                    ...state.newProducts,
                    request: payload
                }
            };
        default:
            return state
    }
};

export default header;