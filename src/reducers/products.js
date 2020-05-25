import initialState from "./initialState";

const products = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.products;
    }

    switch (action.type) {
        case 'SET_PRODUCTS_STATE':
            return {
                ...state,
                ...payload
            };
        case 'SET_PRODUCTS_OPTIONS_KIND':
            return {
                ...state,
                options: {
                    ...state.options,
                    kind: payload
                }
            };
        case 'SET_PRODUCTS_REQUEST':
            return {
                ...state,
                productsRequest: payload
            };
        case 'SET_PRODUCTS_OPTIONS_SEARCH':
            return {
                ...state,
                options: {
                    ...state.options,
                    q: payload
                }
            };
        case 'DELETE_PRODUCT':
            const productIndex = state.products.data.findIndex((item) => item.id === payload);
            const products = state.products.data;
            products.splice(productIndex, 1);
            return {
                ...state,
                products: {
                    ...state.products,
                    data: products
                }
            };
        default:
            return state
    }
};

export default products;