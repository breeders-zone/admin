import {DataService} from "../services";

const dataService = new DataService();

export const setTraits = (payload) => {
    return {
        type: 'SET_TRAITS',
        payload
    }
};

export const deleteTrait = (payload) => (dispatch, getState) => {
    const state = getState();
    const allTraits = state.traits.data;
    const traitIdx = allTraits.findIndex((item) => item.id === payload);
    if (traitIdx >= 0) {
        allTraits.splice(traitIdx, 1);
    }

    dataService.deleteTrait(payload);

    dispatch({
        type: 'DELETE_TRAIT',
        payload: allTraits
    })
};

export const setTraitsRequest = (payload) => {
    return {
        type: 'SET_TRAITS_REQUEST',
        payload
    }
};