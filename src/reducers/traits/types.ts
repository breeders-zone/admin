import { ActionType } from 'typesafe-actions';
import * as traitsActions from "../../actions/traits/traits"

export interface ITraitGroup {
    id: number,
    title: string,
    label: string,
    type: 'recessive'|'dominant'|'other',
    edit: boolean|null
}

export interface ITraitState {
    id: number,
    trait_group_id: number,
    title: string,
    type: 'recessive'|'dominant'|'other',
    traitGroup: Array<ITraitGroup>|null
}

export interface ITraitsState {
    traitsGroups: Array<ITraitGroup>
    request: boolean,
    current_page: number|null,
    last_page: number|null,
    data: Array<ITraitState>
}

export type TraitsActionType = ActionType<typeof traitsActions>


