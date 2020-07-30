import {DataService} from "../services";

const dataService = new DataService();

export const setDocuments = (payload) => {
    return {
        type: 'SET_DOCUMENTS',
        payload
    }
};

export const deleteDocument = (payload) => (dispatch, getState) => {
    const state = getState();
    const allDocuments = state.documents.data;
    const faqIdx = allDocuments.findIndex((item) => item.label === payload);
    if (faqIdx >= 0) {
        allDocuments.splice(faqIdx, 1);
    }

    dataService.deleteDocument(payload);

    dispatch({
        type: 'DELETE_DOCUMENT',
        payload: allDocuments
    })
};

export const setDocumentsRequest = (payload) => {
    return {
        type: 'SET_DOCUMENTS_REQUEST',
        payload
    }
};
