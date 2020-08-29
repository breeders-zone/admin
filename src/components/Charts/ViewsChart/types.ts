import {IStatsAction} from "../../../reducers/stats/types";
import {ChartData} from "chart.js";

export interface IMapStateProps {
    stats: {
        views: ChartData
    }
}

export interface IStateProps {
    views: ChartData
}

interface IDispatchProps {
    setViewsStats: (payload: ChartData) => IStatsAction
}

export type ViewsChartPropsType = IStateProps & IDispatchProps

export interface IYMData {
    query: {
        date1: string,
        date2: string
    },

    data: {
        metrics: number[][]
    }[]
}
