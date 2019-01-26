import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    email: '',
    password: '',
};

export default function(state=initialState, action) {
    switch (action.type) {
        case LOGIN_EXECUTIVE:
            return {
                ...state,
                isAuthenticated: true,
                ...action.payload
            };
        
        case LOGOUT_EXECUTIVE:
            return {
                isAuthenticated: false,
                email: '',
                password: '',
            }

        default:
            return {
                ...state,
            };
    }
}