export const setKind = (payload) => {
    return {
        type: 'SET_KIND',
        payload
    }
};

export const setKindRequest = (payload) => {
    return {
        type: 'SET_KIND_REQUEST',
        payload
    }
};

export const clearKind = () => {
    return {
        type: 'CLEAR_KIND'
    }
};
