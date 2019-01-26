//importing types
import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
} from './types';

//action for executive login
export const loginUser = (data, dispatch) => {
    dispatch((dispatcher) => {
        dispatcher({
            type: LOGIN_EXECUTIVE,
            payload: data,
        });
    });
};

//action for executive logout
export const signOutUser = (dispatch) => {
    dispatch({
        type: LOGOUT_EXECUTIVE,
    });
};
