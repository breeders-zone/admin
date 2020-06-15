import initialState from "./initialState";

const kinds = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.subcategories;
    }

    switch (action.type) {
        case 'SET_SUBCATEGORIES':
            return {
                all: payload,
                request: false
            };
        case 'DELETE_SUBCATEGORY':
            return  {
                ...state,
                all: [...payload]
            };
        default:
            return state
    }
};

export default kinds;