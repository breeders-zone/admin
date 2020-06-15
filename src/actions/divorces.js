import {DataService} from "../services";
const dataService = new DataService();

export const setDivorcesState = (payload) => {
    return {
        type: 'SET_DIVORCES_STATE',
        payload
    }
};

export const setDivorcesOptionsKind = (payload) => {
    return {
        type: 'SET_DIVORCES_OPTIONS_KIND',
        payload
    }
};

export const setDivorcesRequest = (payload) => {
    return {
        type: 'SET_DIVORCES_REQUEST',
        payload
    }
};

export const setDivorcesOptionsSearch = (payload) => {
    return {
        type: 'SET_DIVORCES_OPTIONS_SEARCH',
        payload
    }
};

export const deleteDivorce = (payload) => {
    dataService.deleteDivorce(payload);
    return {
          type: 'DELETE_PRODUCT',
          payload
      }
};