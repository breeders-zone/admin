import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import products from "./products";
import kinds from "./kinds";
const createRootReducer = (history) => combineReducers({
    products,
    kinds,
    router: connectRouter(history)
});

export default createRootReducer;