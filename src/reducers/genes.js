import initialState from "./initialState";

const genes = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.genes;
    }

    switch (action.type) {
        case 'SET_GENES':
            return {
                ...state,
                ...payload,
                request: false
            };
        case 'SET_GENES_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'DELETE_GENE':
            return {
                ...state,
                data: [...payload]
            };
        default:
            return state
    }
};

export default genes;