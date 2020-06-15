import initialState from "./initialState";

const report = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.report;
    }

    switch (action.type) {
        case 'SET_REPORT':
            return {
                ...state,
                ...payload
            };
        case 'SET_REPORT_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'CLEAR_REPORT':
            return initialState.report;
        default:
            return state
    }
};

export default report;