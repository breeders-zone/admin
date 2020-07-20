export const setFaq = (payload) => {
    return {
        type: 'SET_FAQ',
        payload
    }
};

export const setFaqRequest = (payload) => {
    return {
        type: 'SET_FAQ_REQUEST',
        payload
    }
};

export const clearFaq = () => {
    return {
        type: 'CLEAR_FAQ'
    }
};
