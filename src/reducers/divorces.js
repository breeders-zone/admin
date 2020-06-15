import initialState from "./initialState";

const divorces = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.divorces;
    }

    switch (action.type) {
        case 'SET_DIVORCES_STATE':
            return {
                ...state,
                ...payload
            };
        case 'SET_DIVORCES_OPTIONS_KIND':
            return {
                ...state,
                options: {
                    ...state.options,
                    kind: payload
                }
            };
        case 'SET_DIVORCES_REQUEST':
            return {
                ...state,
                divorcesRequest: payload
            };
        case 'SET_DIVORCES_OPTIONS_SEARCH':
            return {
                ...state,
                options: {
                    ...state.options,
                    q: payload
                }
            };
        case 'DELETE_PRODUCT':
            const productIndex = state.data.findIndex((item) => item.id === payload);
            const divorces = state.data;
            divorces.splice(productIndex, 1);
            return {
                ...state,
                data: divorces
            };
        default:
            return state
    }
};

export default divorces;