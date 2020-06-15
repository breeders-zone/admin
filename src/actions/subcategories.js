import {DataService} from "../services";

const dataService = new DataService();

export const setSubcategories = (payload) => {
    return {
        type: 'SET_SUBCATEGORIES',
        payload
    }
};

export const deleteSubcategory = (payload) => (dispatch, getState) => {
    const state = getState();
    const allSubcategories = state.subcategories.all;
    const subcategoryIdx = allSubcategories.findIndex((item) => item.id === payload);
    if (subcategoryIdx >= 0) {
        allSubcategories.splice(subcategoryIdx, 1);
    }

    dataService.deleteSubcategory(payload);

    dispatch({
        type: 'DELETE_SUBCATEGORY',
        payload: allSubcategories
    })
};