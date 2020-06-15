export const setReport = (payload) => {
    return {
        type: 'SET_REPORT',
        payload: {
            ...payload,
        }
    }
};

export const setReportRequest = (payload) => {
    return {
        type: 'SET_REPORT_REQUEST',
        payload
    }
};

export const clearReport = () => {
    return {
        type: 'CLEAR_REPORT'
    }
};
