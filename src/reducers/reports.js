import initialState from "./initialState";

const reports = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.reports;
    }

    switch (action.type) {
        case 'SET_REPORTS':
            return {
                ...state,
                ...payload,
                request: false
            };
        case 'SET_REPORTS_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'DELETE_REPORT':
            return {
                ...state,
                data: [...payload]
            };
        default:
            return state
    }
};

export default reports;