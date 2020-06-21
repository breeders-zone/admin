import initialState from "./initialState";

const products = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.product;
    }

    switch (action.type) {
        case 'SET_PRODUCT':
            return {
                ...state,
                ...payload
            };
        case 'SET_PRODUCT_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'SET_PRODUCT_SEARCH_MORPHS_RESULT':
            return {
                ...state,
                searchMorphsResult: payload
            };
        case 'SET_PRODUCT_MORPH':
            return {
                ...state,
                morphs: [payload, ...state.morphs]
            };
        case 'DELETE_PRODUCT_MORPH':
            return {
                ...state,
                morphs: payload,
            };
        case 'SET_SELECTED_MORPH_IDX':
            return {
                ...state,
                selectedMorphIdx: payload
            };
        default:
            return state
    }
};

export default products;