//importing packages
import axios from 'axios';

//importing types
import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
    GET_ERRORS
} from './types';

//action for executive login
export const loginUser = (data, dispatch) => {
    // dispatch((dispatcher) => {
    //     dispatcher({
    //         type: LOGIN_EXECUTIVE,
    //         payload: data,
    //     });
    // });
    axios.post('http://localhost:8000/auth/executive/login', data)
        .then(res => {
            // console.log(res.data.body.accessToken);
            if(res.data.success) {
                console.log('from auth  action ' + res.data.message);
                dispatch((dispatcher) => {
                    dispatcher({
                        type: LOGIN_EXECUTIVE,
                        payload: data,
                    });
                });
                const accessToken = res.data.body.accessToken;
                localStorage.setItem('AccessToken', accessToken);
                // console.log(accessToken);
            }
            else {
                console.log('from auth action, '  + res.data.message);
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

//action for executive logout
export const signOutUser = (dispatch) => {
    dispatch({
        type: LOGOUT_EXECUTIVE,
    });
    localStorage.removeItem('AccessToken');
};
