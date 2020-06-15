export const setProduct = (payload) => {
    return {
        type: 'SET_PRODUCT',
        payload
    }
};

export const setProductRequest = (payload) => {
    return {
        type: 'SET_PRODUCT_REQUEST',
        payload
    }
};

export const setProductSearchMorphsResult = (payload) => {

    const arr = [];

    payload.map( (gene) => {
        gene.traits.map((trait) => {
            const geneCopy = gene;
            delete geneCopy.traits;
            arr.push({gene: geneCopy, trait});
        })
    });

    return {
        type: 'SET_PRODUCT_SEARCH_MORPHS_RESULT',
        payload: arr
    }
};

export const setProductMorph = (payload) => (dispatch, getState) => {
    const state = getState();
    const morph = state.product.searchMorphsResult[payload];
    const hasGene = !!state.product.morphs.find((item) => item.gene.id === morph.gene.id);

    if (morph && !hasGene) {
        dispatch({
            type: 'SET_PRODUCT_MORPH',
            payload: morph
        })
    }
};

export const deleteProductMorph = (payload) => (dispatch, getState) => {
    const state = getState();
    const morphs = state.product.morphs;
    morphs.splice(payload, 1);
    dispatch({
        type: 'DELETE_PRODUCT_MORPH',
        payload: morphs
    });
};

export const setSelectedMorphIdx = (payload) => {
    return {
        type: 'SET_SELECTED_MORPH_IDX',
        payload
    }
};

export const setProductLocality = (payload) => (dispatch, getState) => {
    const state = getState();
    const localities = state.product.localities;
    localities[payload.idx] = payload.locality;

    dispatch({
        type: 'SET_PRODUCT_LOCALITY',
        payload: localities
    });
};

export const deleteProductLocality = (payload) => (dispatch, getState) => {
    const state = getState();
    const localities = state.product.localities;
    localities.splice(payload, 1);

    dispatch({
        type: 'DELETE_PRODUCT_LOCALITY',
        payload: localities
    })
};

export const addProductLocality = (payload) => {
    return {
        type: 'ADD_PRODUCT_LOCALITY',
        payload
    }
};
