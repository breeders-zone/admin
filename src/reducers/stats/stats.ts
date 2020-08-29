import {IStatsAction, IStatsState} from "./types";

const initialState: IStatsState = {
    views: {
        labels: [],
        datasets: []
    },
    visits: []
};

const stats = (state = initialState, action: IStatsAction) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case 'SET_VIEWS_STATS':
            return {
                ...state,
                views: payload
            };
        case 'SET_VISITS_STATS':
            return {
                ...state,
                visits: payload
            };
        default:
            return state
    }
};

export default stats;
