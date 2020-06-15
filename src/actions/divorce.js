export const setDivorce = (payload) => {
    return {
        type: 'SET_DIVORCE',
        payload
    }
};

export const setDivorceRequest = (payload) => {
    return {
        type: 'SET_DIVORCE_REQUEST',
        payload
    }
};

export const setDivorceSearchMorphsMaleResult = (payload) => {

    const arr = [];

    payload.map( (gene) => {
        gene.traits.map((trait) => {
            const geneCopy = gene;
            delete geneCopy.traits;
            arr.push({gene: geneCopy, trait});
        })
    });

    return {
        type: 'SET_DIVORCE_SEARCH_MORPHS_MALE_RESULT',
        payload: arr
    }
};

export const setDivorceSearchMorphsFemaleResult = (payload) => {

    const arr = [];

    payload.map( (gene) => {
        gene.traits.map((trait) => {
            const geneCopy = gene;
            delete geneCopy.traits;
            arr.push({gene: geneCopy, trait});
        })
    });

    return {
        type: 'SET_DIVORCE_SEARCH_MORPHS_FEMALE_RESULT',
        payload: arr
    }
};

export const setSelectedMorphMaleIdx = (payload) => {
    return {
        type: 'SET_SELECTED_MORPH_MALE_IDX',
        payload
    }
};

export const setSelectedMorphFemaleIdx = (payload) => {
    return {
        type: 'SET_SELECTED_MORPH_FEMALE_IDX',
        payload
    }
};
