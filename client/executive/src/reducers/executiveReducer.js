import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
    SET_CURRENT_USER
} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    email: ''
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
                email: ''
            }

        case SET_CURRENT_USER:
            return {
                isAuthenticated: !(typeof action.payload === 'object' && Object.keys(action.payload).length === 0),
                email: action.payload.email
            }

        default:
            return {
                ...state,
            };
    }
}