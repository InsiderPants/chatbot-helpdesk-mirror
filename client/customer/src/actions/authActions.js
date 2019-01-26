import {LOGIN_USER, SIGNOUT_USER, RECIVE_PREVIOUS_CHAT} from './types';

export const loginUser = (data, dispatch) => {
    dispatch((dispatcher) => {
        dispatcher({
            type: LOGIN_USER,
            payload: data.userInfo
        });
        dispatcher({
            type: RECIVE_PREVIOUS_CHAT,
            payload: data.previousChat
        })
    });
};

export const signOutUser = (dispatch) => {
    dispatch({
        type: SIGNOUT_USER
    });
};