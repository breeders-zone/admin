import {ICurrenciesState} from "./types";
import {AnyAction} from "redux";

const initialState: ICurrenciesState = {
   all: []
};

const currencies = (state = initialState, action: AnyAction) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case "SET_CURRENCIES":
            return {
                ...state,
                all: payload
            };
        default:
            return state
    }
};

export default currencies;
