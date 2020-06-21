export const setLocality = (payload) => {
    return {
        type: 'SET_LOCALITY',
        payload
    }
};

export const setLocalityRequest = (payload) => {
    return {
        type: 'SET_LOCALITY_REQUEST',
        payload
    }
};

export const clearLocality = () => {
    return {
        type: 'CLEAR_LOCALITY'
    }
};
