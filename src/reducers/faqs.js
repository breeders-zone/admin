import initialState from "./initialState";

const faqs = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.faqs;
    }

    switch (action.type) {
        case 'SET_FAQS':
            return {
                ...state,
                data: payload,
                request: false
            };
        case 'SET_FAQS_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'DELETE_FAQ':
            return {
                ...state,
                data: [...payload]
            };
        default:
            return state
    }
};

export default faqs;