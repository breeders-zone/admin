import {IStatsAction, IVisitsState} from "../reducers/stats/types";
import {ChartData} from "chart.js";

export const setViewsStats = (payload: ChartData): IStatsAction => {
    return {
        type: 'SET_VIEWS_STATS',
        payload
    }
};

export const setVisitsStats = (payload: Array<IVisitsState>): IStatsAction => {
    return {
        type: 'SET_VISITS_STATS',
        payload
    }
};
