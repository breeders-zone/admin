export const setLevel = (payload) => {
    return {
        type: 'SET_LEVEL',
        payload
    }
};

export const setLevelRequest = (payload) => {
    return {
        type: 'SET_LEVEL_REQUEST',
        payload
    }
};

export const clearLevel = () => {
    return {
        type: 'CLEAR_LEVEL'
    }
};
