import {ITraitsState} from "../../reducers/traits/types";
import {Location} from "history";
import {DataService} from "../../services";
import {setTraitsGroups, setTraits, deleteTrait, setTraitsRequest, setTraitGroup} from "../../actions/traits/traits";


export interface IMapStateProps {
    traits: ITraitsState
    router: {
        location: {
            query: {
                [key: string]: string
            }
        }
    }
}

export interface IMapMethodsProps {
    getTraits: typeof DataService.prototype.getTraits,
    getTraitsGroups: typeof DataService.prototype.getTraitsGroups
}

export interface IStateProps {
    traits: ITraitsState
    router: {
        location: {
            query: {
                [key: string]: string
            }
        }
    }
}

export interface IDispatchProps {
    setTraits: typeof setTraits
    deleteTrait: typeof deleteTrait
    setTraitsRequest: typeof setTraitsRequest,
    setTraitsGroups: typeof setTraitsGroups,
    setTraitGroup: typeof setTraitGroup
}

export interface IOtherProps {
    location: Location
}

export type TraitsPropsType = IStateProps & IDispatchProps & IMapMethodsProps & IOtherProps
