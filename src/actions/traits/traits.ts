import {DataService} from "../../services";
import {ITraitGroup, ITraitState} from "../../reducers/traits/types";
import {Dispatch} from "redux";
import {State} from "../../reducers";

const dataService = new DataService();

export const setTraits = (payload: Array<ITraitState>) => {
    return {
        type: 'SET_TRAITS',
        payload
    }
};

export const deleteTrait = (payload: number) => (dispatch: Dispatch, getState: () => State): void => {
    const state = getState();
    const allTraits = state.traits.data;
    const traitIdx = allTraits.findIndex((item) => item.id === payload);
    if (traitIdx >= 0) {
        allTraits.splice(traitIdx, 1);
    }

    dataService.deleteTrait(payload);

    dispatch({
        type: 'DELETE_TRAIT',
        payload: [...allTraits]
    })
};

export const setTraitsRequest = (payload: boolean) => {
    return {
        type: 'SET_TRAITS_REQUEST',
        payload
    }
};

export const setTraitsGroups = (payload: Array<ITraitGroup>) => {
    return {
        type: 'SET_TRAITS_GROUPS',
        payload
    }
};

export const setTraitGroup = (payload: ITraitGroup & {idx?: number}) => (dispatch: Dispatch, getState: () => State): void => {
    const state = getState();
    const allTraitsGroup = state.traits.traitsGroups;
    const traitGroupIdx = allTraitsGroup.findIndex((item) => item.id === payload.id);

    if (typeof payload.idx !== 'undefined' && payload.idx >= 0) {
        const traitGroup: ITraitGroup = {
            id: payload.id,
            title: payload.title,
            label: payload.label,
            type: payload.type,
            edit: payload.edit
        };

        allTraitsGroup[payload.idx] = traitGroup;

        dispatch({
            type: 'SET_TRAIT_GROUP',
            payload: [...allTraitsGroup]
        });

        return;
    }

    console.log(payload);

    if (payload.id && traitGroupIdx) {
        allTraitsGroup[traitGroupIdx] = payload;

        dispatch({
            type: 'SET_TRAIT_GROUP',
            payload: [...allTraitsGroup]
        });

        return;
    }

    dispatch(
        {
            type: 'SET_TRAIT_GROUP',
            payload: [payload, ...allTraitsGroup]
        }
    )
};

export const editTraitGroup = (payload: number) => (dispatch: Dispatch, getState: () => State): void => {
    const state = getState();
    const allTraitsGroup = state.traits.traitsGroups;
    const traitGroupIdx = allTraitsGroup.findIndex((item) => item.id === payload);
    allTraitsGroup[traitGroupIdx].edit = !allTraitsGroup[traitGroupIdx].edit;

    dispatch({
        type: 'EDIT_TRAIT_GROUP',
        payload: [...allTraitsGroup]
    })
};


export const deleteTraitGroup = (payload: number) => (dispatch: Dispatch, getState: () => State): void => {
    const state = getState();
    const allTraitsGroup = state.traits.traitsGroups;
    const traitGroupIdx = allTraitsGroup.findIndex((item) => item.id === payload);
    if (traitGroupIdx >= 0) {
        allTraitsGroup.splice(traitGroupIdx, 1);
    }

    dataService.deleteTraitGroup(payload);

    dispatch({
        type: 'DELETE_TRAIT_GROUP',
        payload: [...allTraitsGroup]
    })
};
