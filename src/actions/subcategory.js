export const setSubcategory = (payload) => {
    return {
        type: 'SET_SUBCATEGORY',
        payload
    }
};

export const setSubcategoryRequest = (payload) => {
    return {
        type: 'SET_SUBCATEGORY_REQUEST',
        payload
    }
};

export const clearSubcategory = () => {
    return {
        type: 'CLEAR_SUBCATEGORY'
    }
};
