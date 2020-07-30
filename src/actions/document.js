export const setDocument = (payload) => {
    return {
        type: 'SET_DOCUMENT',
        payload
    }
};

export const setDocumentRequest = (payload) => {
    return {
        type: 'SET_DOCUMENT_REQUEST',
        payload
    }
};

export const clearDocument = () => {
    return {
        type: 'CLEAR_DOCUMENT'
    }
};
