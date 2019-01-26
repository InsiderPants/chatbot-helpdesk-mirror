import {LOGIN_USER, SIGNOUT_USER} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    name: '',
    email: '',
    contact: ''
};

export default function(state=initialState, action){
    switch(action.type){
        case LOGIN_USER:
            /* 
                action.payload = {
                    name, email, contact
                }
            */
            return {
                ...state,
                isAuthenticated: true,
                ...action.payload
            };
        case SIGNOUT_USER:
            /* 
                action.payload = undefined
            */
            return {
                isAuthenticated: false,
                name: '',
                email: '',
                contact: ''
            };
        default:
            return {...state};
    }
}