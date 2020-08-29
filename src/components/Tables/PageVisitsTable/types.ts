import {IStatsAction, IVisitsState} from "../../../reducers/stats/types";
import {setVisitsStats} from "../../../actions/stats";

export interface IYMData {
    data: Array<IVisitsState>
}

export interface IMapStateProps {
    stats: {
        visits: Array<IVisitsState>
    }
}

export interface IStateProps {
    visits: Array<IVisitsState>
}

export interface IPageVisitsTableProps {
    visits: Array<IVisitsState>,
    setVisitsStats: (payload: Array<IVisitsState>) => IStatsAction
}
