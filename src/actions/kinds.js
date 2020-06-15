import {DataService} from "../services";

const dataService = new DataService();

export const setKinds = (payload) => {
    return {
        type: 'SET_KINDS',
        payload
    }
};

export const deleteKind = (payload) => (dispatch, getState) => {
    const state = getState();
    const allKinds = state.kinds.all;
    const kindIdx = allKinds.findIndex((item) => item.id === payload);
    if (kindIdx >= 0) {
        allKinds.splice(kindIdx, 1);
    }

    dataService.deleteKind(payload);

    dispatch({
        type: 'DELETE_KIND',
        payload: allKinds
    })
};