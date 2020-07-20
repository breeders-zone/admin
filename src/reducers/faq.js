import initialState from "./initialState";

const faq = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.faq;
    }

    switch (action.type) {
        case 'SET_FAQ':
            return {
                ...state,
                ...payload
            };
        case 'SET_FAQ_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_FAQ':
            return initialState.faq;
        default:
            return state
    }
};

export default faq;