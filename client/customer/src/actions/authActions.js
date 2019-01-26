import {LOGIN_USER, SIGNOUT_USER, RECIVE_PREVIOUS_CHAT} from './types';

/**
 * 
 * @param {{userInfo: Object, previousChat: Array}} data 
 * @param {Object} dispatch  Action Dispatcher
 */
export const loginUser = (data, dispatch) => {
    dispatch((dispatcher) => {
        // Login the user on the client side -----
        dispatcher({
            type: LOGIN_USER,
            payload: data.userInfo
        });

        // For loading the previous chats of the user ----
        dispatcher({
            type: RECIVE_PREVIOUS_CHAT,
            payload: data.previousChat
        })
    });
};

/**
 * 
 * @param {Object} dispatch Action Dispatcher
 */
export const signOutUser = (dispatch) => {
    // SignOut user from the client side ----
    dispatch({
        type: SIGNOUT_USER
    });
};
