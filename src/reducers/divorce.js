import initialState from "./initialState";

const divorce = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.divorce;
    }

    switch (action.type) {
        case 'SET_DIVORCE':
            return {
                ...state,
                ...payload
            };
        case 'SET_DIVORCE_REQUEST':
            return {
                ...state,
                request: payload
            };
        case 'SET_DIVORCE_SEARCH_MORPHS_MALE_RESULT':
            return {
                ...state,
                searchMorphsMaleResult: payload
            };
        case 'SET_DIVORCE_SEARCH_MORPHS_FEMALE_RESULT':
            return {
                ...state,
                searchMorphsFemaleResult: payload
            };
        case 'SET_SELECTED_MORPH_MALE_IDX':
            return {
                ...state,
                selectedMorphMaleIdx: payload
            };
        case 'SET_SELECTED_MORPH_FEMALE_IDX':
            return {
                ...state,
                selectedMorphFemaleIdx: payload
            };
        default:
            return state
    }
};

export default divorce;