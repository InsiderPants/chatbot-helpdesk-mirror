import axios from 'axios';

import { REGISTER_EXECUTIVE, GET_ERRORS } from './types';

export const registerExecutive = (data, dispatch) => {
    axios.post('/auth/executive/signup', data)
        .then(res => {
            if(res.data.success) {
                dispatch((dispatcher) => {
                    dispatcher({
                        type: REGISTER_EXECUTIVE,
                        payload: data,
                    })
                })
            }
            else {
                dispatch((dispatcher) => {
                    dispatcher({
                        type: GET_ERRORS,
                        payload: res.data.message,
                    })
                })
            }
        })
        .catch(err => {
            dispatch((dispatcher) => {
                dispatcher({
                    type: GET_ERRORS,
                    payload: (err.response) ? err : "Unknown Error Occured",
                })
            })
        })
};
