import {DataService} from "../services";
const dataService = new DataService();

export const setUsers = (payload) => {
    return {
        type: 'SET_USERS',
        payload
    }
};

export const setUsersOptionsSort = (payload) => (dispatch) =>  {
    let sortTitle = 'Все пользователи';
    switch(payload) {
        case 'shops':
            sortTitle = 'Только магазины';
            break;
        case 'guards':
            sortTitle = 'Только хранители';
            break;
        case 'users':
            sortTitle = 'Только пользователи';
            break;
    }

    dispatch({
        type: 'SET_USERS_SORT_TITLE',
        payload: sortTitle
    });

    dispatch({
        type: 'SET_USERS_OPTIONS_SORT',
        payload
    });
};

export const setUsersRequest = (payload) => {
    return {
        type: 'SET_USERS_REQUEST',
        payload
    }
};

export const setUsersOptionsSearch = (payload) => {
    return {
        type: 'SET_USERS_OPTIONS_SEARCH',
        payload
    }
};

export const deleteUser = (payload) => {
    dataService.deleteUser(payload);
    return {
          type: 'DELETE_USER',
          payload
      }
};

export const setUserActive = (payload) => (dispatch, getState) => {
    const state = getState();
    const users = state.users.data;
    users[payload.idx].active = payload.active;

    dispatch({
        type: 'SET_USER_ACTIVE',
        payload: users
    })
};

export const setUserIsBreeder = (payload) => (dispatch, getState) => {
    const state = getState();
    const users = state.users.data;
    users[payload.idx].is_breeder = payload.isBreeder;

    dispatch({
        type: 'SET_USER_IS_BREEDER',
        payload: users
    })
};

export const setUserIsGuard = (payload) => (dispatch, getState) => {
    const state = getState();
    const users = state.users.data;
    users[payload.idx].is_guard = payload.isGuard;

    dispatch({
        type: 'SET_USER_IS_GUARD',
        payload: users
    })
};