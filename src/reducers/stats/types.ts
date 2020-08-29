import {ChartData} from "chart.js";

export interface IVisitsState {
    dimensions: Array<{
        name: string,
    }>,
    metrics: Array<number>
}

export interface IStatsState {
    views: ChartData,
    visits: Array<IVisitsState>
}

export interface IStatsAction {
    type: 'SET_VIEWS_STATS'|'SET_VISITS_STATS',
    payload: ChartData|Array<IVisitsState>
}


