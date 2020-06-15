import initialState from "./initialState";

const subcategory = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.subcategory;
    }

    switch (action.type) {
        case 'SET_SUBCATEGORY':
            return {
                ...state,
                ...payload
            };
        case 'SET_SUBCATEGORY_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_SUBCATEGORY':
            return initialState.subcategory;
        default:
            return state
    }
};

export default subcategory;