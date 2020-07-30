import initialState from "./initialState";

const document = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.document;
    }

    switch (action.type) {
        case 'SET_DOCUMENT':
            return {
                ...state,
                ...payload
            };
        case 'SET_DOCUMENT_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_DOCUMENT':
            return initialState.document;
        default:
            return state
    }
};

export default document;
