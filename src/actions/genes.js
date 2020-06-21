import {DataService} from "../services";

const dataService = new DataService();

export const setGenes = (payload) => {
    return {
        type: 'SET_GENES',
        payload
    }
};

export const deleteGene = (payload) => (dispatch, getState) => {
    const state = getState();
    const allGenes = state.genes.data;
    const geneIdx = allGenes.findIndex((item) => item.id === payload);
    if (geneIdx >= 0) {
        allGenes.splice(geneIdx, 1);
    }

    dataService.deleteGene(payload);

    dispatch({
        type: 'DELETE_GENE',
        payload: allGenes
    })
};

export const setGenesRequest = (payload) => {
    return {
        type: 'SET_GENES_REQUEST',
        payload
    }
};

export const setGenesOptionSearch = (payload) => {
    return {
        type: 'SET_GENES_OPTION_SEARCH',
        payload
    }
};