import {push} from "connected-react-router";
import DataService from "../services/DataService";
const dataService = new DataService();

export const getUser = (redirectRoute = '') => (dispatch) =>  {
    dispatch(setProfileRequest(true));
    dataService.getProfile()
        .then((data) => {
            if (redirectRoute) {
                dispatch(push(redirectRoute))
            }
            dispatch(setProfile(data));
        })
        .catch(() => dispatch(logout()))
};

export const setProfile = (payload) => {
    return {
        type: 'SET_PROFILE',
        payload
    }
};

export const setProfileRequest = (payload) => {
    return {
        type: 'SET_PROFILE_REQUEST',
        payload
    }
};

export const logout = () => (dispatch) => {
    dataService.logout();
    localStorage.removeItem('token');
    dispatch(push('/auth/login'));
    dispatch(setProfile({}));
};