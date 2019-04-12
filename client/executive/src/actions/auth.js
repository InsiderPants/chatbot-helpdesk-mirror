//importing types
import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
    SET_CURRENT_USER,
    GET_ERRORS
} from './types';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

//action for executive login
export const loginUser = (data, dispatch) => {
    dispatch((dispatcher) => {
        dispatcher({
            type: LOGIN_EXECUTIVE,
            payload: {
                name: data.name,
                email: data.email
            }
        });
        // it stores it as string
        localStorage.setItem('AccessToken', data.accessToken);
        // set token to auth header to send it to server in every request
        // instead of doing it manually, we create a function authActions
        // that automatically attach token to auth header of request
        setAuthToken(data.accessToken);
        // decode token to get user data to get email and name
        const decoded = jwt_decode(data.accessToken);
        // Set current user
        dispatch(setCurrentUser(decoded));
    });
};

export const invalidLogin = (data,dispatch)=>{
    // In case of invalid login/any error during login, set error set
    dispatch((dispatcher) => {
        dispatcher({
            type: GET_ERRORS,
            payload: data.error,
        });
    });  
}

export const setCurrentUser = (decoded)=>{
    // It takes decoded data from token and set in state
    return{
        type:SET_CURRENT_USER,
        payload:decoded
    }
}

export const signOutUserButton = (dispatch) => {
    dispatch((dispatcher) => {
        dispatcher({
            type: LOGOUT_EXECUTIVE,
        })
    });
    // remove token
    localStorage.removeItem('AccessToken');
    // remove auth header for future requests
    setAuthToken(false);
    // set current user to empty object which'll set isAuthenticated to false
    dispatch(setCurrentUser({}));
};

//action for executive logout for app.js
export const signOutUser = () => (dispatch) => {
    dispatch({
        type: LOGOUT_EXECUTIVE,
    });
    // remove token
    localStorage.removeItem('AccessToken');
    // remove auth header for future requests
    setAuthToken(false);
    // set current user to empty object which'll set isAuthenticated to false
    dispatch(setCurrentUser({}));
};
