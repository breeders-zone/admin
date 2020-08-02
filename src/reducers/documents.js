import initialState from "./initialState";

const documents = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.documents;
    }

    switch (action.type) {
        case 'SET_DOCUMENTS':
            return {
                ...state,
                data: payload,
                request: false
            };
        case 'SET_DOCUMENTS_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'DELETE_DOCUMENT':
            return {
                ...state,
                data: [...payload]
            };
        default:
            return state
    }
};

export default documents;
