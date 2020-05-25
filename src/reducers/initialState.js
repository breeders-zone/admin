const initialState = {
    kinds: {
        all: [],
        active: []
    },
    products: {
        products: {
            data: [],
            current_page: null,
            last_page: null
        },
        options: {
            kind: '',
            q: ''
        },
        productsRequest: false
    }
};

export default initialState;