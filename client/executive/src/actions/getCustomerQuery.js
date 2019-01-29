//importing packages
import io from 'socket.io-client';

//importing types
import {
    GET_ERRORS,
    GET_USER_QUERY_FROM_BACKEND,
    GET_EXECUTIVE_ANSWER,
    SAVE_CHAT,
    LOADING_QUERY
} from './types';

const chat = io('/api/executiveGetResolution');
//getting customer query from backend
export const getCustomerQuery = (data, dispatch) => {
    dispatch((dispatcher) => {
        dispatcher({
            type: GET_EXECUTIVE_ANSWER,
            payload: data.message,
        });
        dispatcher({
            type: SAVE_CHAT,
            payload: {
                tag: 'executive',
                message: data.message,
            }
        });
        dispatcher({
            type: LOADING_QUERY,
        });

        //conetion to socket io
        chat.on('executive', (data) => {
            console.log(data);//just for checking
            dispatcher({
                type: GET_USER_QUERY_FROM_BACKEND,
                payload: data.message,
            });
            dispatcher({
                type: SAVE_CHAT,
                payload: {
                    tag: 'user',
                    message: data.message,
                }
            });
        })
        //sending executive chat
        chat.emit('executive', {...data, id: 'executive'})
        //catching errors
        chat.on('error', (err) => {
            dispatcher({
                type: GET_ERRORS,
                payload: (err.response) ? err : "Unknown Error Occured",
            });
        })
    });
};