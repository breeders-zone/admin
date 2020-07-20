import {DataService} from "../services";

const dataService = new DataService();

export const setFaqs = (payload) => {
    return {
        type: 'SET_FAQS',
        payload
    }
};

export const deleteFaq = (payload) => (dispatch, getState) => {
    const state = getState();
    const allFaqs = state.faqs.data;
    const faqIdx = allFaqs.findIndex((item) => item.label === payload);
    if (faqIdx >= 0) {
        allFaqs.splice(faqIdx, 1);
    }

    dataService.deleteFaq(payload);

    dispatch({
        type: 'DELETE_FAQ',
        payload: allFaqs
    })
};

export const setFaqsRequest = (payload) => {
    return {
        type: 'SET_FAQS_REQUEST',
        payload
    }
};