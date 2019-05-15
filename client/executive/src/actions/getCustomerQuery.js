// Importing types
import {
    GET_ERRORS,
    GET_USER_QUERY_FROM_BACKEND,
    GET_EXECUTIVE_ANSWER,
    SAVE_CHAT,
    LOADING_QUERY
} from './types';

// Sending executive answer/response to backend
export const sendExecutiveResponse = (data, socket, dispatch) => {
    dispatch((dispatcher) => {
        // Save executive answer/response in redux state
        dispatcher({
            type: GET_EXECUTIVE_ANSWER,
            payload: data.message,
        });
        // Save executive answer/response with tag into convo array in redux state
        dispatcher({
            type: SAVE_CHAT,
            payload: {
                tag: 'executive',
                message: data.message,
            }
        });
        // Set loading to true for spinner
        dispatcher({
            type: LOADING_QUERY,
        });
        // Send executive answer/response to backend and from there to customer
        socket.emit('executive', {...data, id: 'executive'})
    });
};

// Getting customer query/response from backend
export const getCustomerQuery = (data, dispatch) => {
    dispatch((dispatcher) => {
        // Save customer query/response in redux state and set loading to false to stop spinner
        dispatcher({
            type: GET_USER_QUERY_FROM_BACKEND,
            payload: data.message,
        });
        // Save customer query/response with tag into convo array in redux state
        dispatcher({
            type: SAVE_CHAT,
            payload: {
                tag: 'user',
                message: data.message,
            }
        });
    });
};

// Getting error from backend
export const getError = (err, dispatch) => {
    dispatch((dispatcher) => {
        // Set error in redux state
        dispatcher({
            type: GET_ERRORS,
            payload: (err.response) ? err : "Unknown Error Occured",
        });
    });
};