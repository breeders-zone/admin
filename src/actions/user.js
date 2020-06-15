export const setUser = (payload) => {
    return {
        type: 'SET_USER',
        payload
    }
};

export const setUserRequest = (payload) => {
    return {
        type: 'SET_USER_REQUEST',
        payload
    }
};

export const clearUser = () => {
    return {
        type: 'CLEAR_USER'
    }
};

export const addUserKind = () => (dispatch, getState) => {
    const state = getState();
    const allKinds = state.kinds.all;
    if (allKinds.length > 0) {
        dispatch({
            type: 'ADD_USER_KIND',
            payload: allKinds[0]
        })
    }
};

export const setUserKind = (payload) => (dispatch, getState) => {
    const state = getState();
    const allKinds = state.kinds.all;
    const userKinds = state.user.guardians_kinds;
    const kind = allKinds.find( (item) => item.id === payload.kindId);

    if (kind) {
        userKinds[payload.idx] = kind;
        dispatch({
            type: 'SET_USER_KIND',
            payload: userKinds
        })
    }

};

export const deleteUserKind = (payload) => (dispatch, getState) => {
    const state = getState();
    const userKinds = state.user.guardians_kinds;
    userKinds.splice(payload, 1);

    dispatch({
        type: 'DELETE_USER_KIND',
        payload: userKinds
    })
};
