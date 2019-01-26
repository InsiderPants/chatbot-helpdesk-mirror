import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
} from './types';

export const loginUser = (data, dispatch) => {
    dispatch((dispatcher) => {
        dispatcher({
            type: LOGIN_EXECUTIVE,
            payload: data,
        });
    });
};

export const signOutUser = (dispatch) => {
    dispatch({
        type: LOGOUT_EXECUTIVE,
    });
};
