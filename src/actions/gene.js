export const setGene = (payload) => {
    return {
        type: 'SET_GENE',
        payload
    }
};

export const setGeneRequest = (payload) => {
    return {
        type: 'SET_GENE_REQUEST',
        payload
    }
};

export const clearGene = () => {
    return {
        type: 'CLEAR_GENE'
    }
};
