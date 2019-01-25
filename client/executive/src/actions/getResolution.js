import axios from 'axios';
import { GET_ERRORS, GET_USER_QUERY_FROM_BACKEND, GET_EXECUTIVE_ANSWER, SAVE_CHAT, LOADING_QUERY } from './types';

export const getResolution = (data, dispatch) => {
    dispatch((dispatcher)=> {
        dispatcher({
            type: GET_EXECUTIVE_ANSWER,
            payload: data.message,
        });
        dispatcher({
            type: SAVE_CHAT,
            payload: {
                tag:'executive',
                message: data.message,
            }
        });
        dispatcher({
            type: LOADING_QUERY,
        });

        axios.post('/api/executiveGetResolution', data)
            .then(res => {
                dispatcher({
                    type: GET_USER_QUERY_FROM_BACKEND,
                    payload: res.data.reply,
                });
                dispatcher({
                    type: SAVE_CHAT,
                    payload: {
                        tag: 'user',
                        message: res.data.reply,
                    }
                });
            })
            .catch(err => {
                dispatcher({
                    type: GET_ERRORS,
                    payload: (err.response) ? err.response.data : "Unknown Error Occured",
                });
            })
    });
};