import {DataService} from "../services";

const dataService = new DataService();

export const setReports = (payload) => {
    return {
        type: 'SET_REPORTS',
        payload
    }
};

export const deleteReport = (payload) => (dispatch, getState) => {
    const state = getState();
    const allReports = state.reports.data;
    const reportIdx = allReports.findIndex((item) => item.id === payload);
    if (reportIdx >= 0) {
        allReports.splice(reportIdx, 1);
    }

    dataService.deleteReport(payload);

    dispatch({
        type: 'DELETE_REPORT',
        payload: allReports
    })
};

export const setReportsRequest = (payload) => {
    return {
        type: 'SET_REPORTS_REQUEST',
        payload
    }
};