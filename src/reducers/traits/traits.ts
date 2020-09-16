import {TraitsActionType, ITraitsState} from "./types";
const initialState: ITraitsState = {
    traitsGroups: [],
    request: true,
    current_page: null,
    last_page: null,
    data: []
};


const traits = (state = initialState, action: TraitsActionType) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case 'SET_TRAITS':
            return {
                ...state,
                data: payload,
            };
        case 'SET_TRAITS_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'DELETE_TRAIT':
            return {
                ...state,
                data: payload
            };
        case 'SET_TRAITS_GROUPS':
            return {
                ...state,
                traitsGroups: payload
            };
        case 'SET_TRAIT_GROUP':
            return {
                ...state,
                traitsGroups: payload
            };
        case 'EDIT_TRAIT_GROUP':
            return {
                ...state,
                traitsGroups: payload
            };
        case 'DELETE_TRAIT_GROUP':
            return {
                ...state,
                traitsGroups: payload
            };
        default:
            return state
    }
};

export default traits;
