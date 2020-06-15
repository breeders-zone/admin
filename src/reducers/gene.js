import initialState from "./initialState";

const gene = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.gene;
    }

    switch (action.type) {
        case 'SET_GENE':
            return {
                ...state,
                ...payload
            };
        case 'SET_GENE_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_GENE':
            return initialState.gene;
        default:
            return state
    }
};

export default gene;