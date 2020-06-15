import {DataService} from "../services";

const dataService = new DataService();

export const setLocalities = (payload) => {
    return {
        type: 'SET_LOCALITIES',
        payload
    }
};

export const deleteLocality = (payload) => (dispatch, getState) => {
    const state = getState();
    const allLocalities = state.localities.all;
    const subcategoryIdx = allLocalities.findIndex((item) => item.id === payload);
    if (subcategoryIdx >= 0) {
        allLocalities.splice(subcategoryIdx, 1);
    }

    dataService.deleteLocality(payload);

    dispatch({
        type: 'DELETE_LOCALITY',
        payload: allLocalities
    })
};