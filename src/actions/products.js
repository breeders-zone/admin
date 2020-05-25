import {DataService} from "../services";
const dataService = new DataService();

export const setProductsState = (payload) => {
    return {
        type: 'SET_PRODUCTS_STATE',
        payload
    }
};

export const setProductsOptionsKind = (payload) => {
    return {
        type: 'SET_PRODUCTS_OPTIONS_KIND',
        payload
    }
};

export const setProductsRequest = (payload) => {
    return {
        type: 'SET_PRODUCTS_REQUEST',
        payload
    }
};

export const setProductsOptionsSearch = (payload) => {
    return {
        type: 'SET_PRODUCTS_OPTIONS_SEARCH',
        payload
    }
};

export const deleteProduct = (payload) => {
    dataService.deleteProduct(payload);
    return {
          type: 'DELETE_PRODUCT',
          payload
      }
};