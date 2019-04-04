//importing types
import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
    GET_ERRORS
} from './types';

//action for executive login
export const loginUser = (data, dispatch) => {
    dispatch((dispatcher) => {
        dispatcher({
            type: LOGIN_EXECUTIVE,
            payload: {
                email: data.email,
                password: data.password
            }
        });
        localStorage.setItem('AccessToken', data.accessToken);
    });
};

export const invalidLogin = (data,dispatch)=>{
    dispatch((dispatcher) => {
        dispatcher({
            type: GET_ERRORS,
            payload: data.error,
        });
    });  
}

//action for executive logout
export const signOutUser = (dispatch) => {
    dispatch({
        type: LOGOUT_EXECUTIVE,
    });
    localStorage.removeItem('AccessToken');
};
