export const setTrait = (payload) => {
    return {
        type: 'SET_TRAIT',
        payload
    }
};

export const setTraitRequest = (payload) => {
    return {
        type: 'SET_TRAIT_REQUEST',
        payload
    }
};

export const clearTrait = () => {
    return {
        type: 'CLEAR_TRAIT'
    }
};
