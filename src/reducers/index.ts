import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import products from "./products";
import kinds from "./kinds";
import profile from "./profile";
import product from "./product";
import divorces from "./divorces";
import divorce from "./divorce";
import kind from "./kind";
import subcategories from "./subcategories";
import localities from "./localities";
import subcategory from "./subcategory";
import locality from "./locality";
import genes from "./genes";
import gene from "./gene";
import traits from "./traits/traits";
import trait from "./trait";
import users from "./users";
import user from "./user";
import reports from "./reports";
import report from "./report";
import level from "./level";
import levels from "./levels";
import header from "./header";
import faqs from "./faqs";
import faq from "./faq";
import documents from "./documents";
import documentReducer from "./document";
import initialState from "./initialState";
import stats from "./stats/stats";
import currencies from "./currencies/currencies";
import {History} from "history";
import {IStatsState} from "./stats/types";
import {ITraitsState, ITraitState} from "./traits/types";

const createRootReducer = (history: History) => combineReducers({
    currencies,
    stats,
    header,
    kind,
    kinds,
    subcategory,
    subcategories,
    locality,
    localities,
    gene,
    genes,
    trait,
    traits,
    product,
    products,
    divorce,
    divorces,
    report,
    reports,
    faqs,
    faq,
    document: documentReducer,
    documents,
    level,
    levels,
    user,
    users,
    profile,
    router: connectRouter(history)
});

export type State = {
    stats: IStatsState,
    traits: ITraitsState,
    trait: ITraitState
};

export default createRootReducer;

export {
    initialState,

}
