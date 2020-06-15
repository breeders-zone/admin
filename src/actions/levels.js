import {DataService} from "../services";

const dataService = new DataService();

export const setLevels = (payload) => {
    return {
        type: 'SET_LEVELS',
        payload
    }
};

export const setLevelsRequest = (payload) => {
    return {
        type: 'SET_LEVELS_REQUEST',
        payload
    }
};

export const deleteLevel = (payload) => (dispatch, getState) => {
    const state = getState();
    const allLevels = state.levels.data;
    const levelIdx = allLevels.findIndex((item) => item.level === payload.level);
    if (levelIdx >= 0) {
        allLevels.splice(levelIdx, 1);
    }

    if (payload.isGuardLevel) {
        dataService.deleteGuardLevel(payload.level);
    } else {
        dataService.deleteBreederLevel(payload.level);
    }


    dispatch({
        type: 'DELETE_LEVEL',
        payload: allLevels
    })
};