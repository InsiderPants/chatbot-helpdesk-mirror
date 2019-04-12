import {
    LOGIN_EXECUTIVE,
    LOGOUT_EXECUTIVE,
    SET_CURRENT_USER
} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    name: '',
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
                ...state,
                isAuthenticated: false,
                email: '',
                name: ''
            }

        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !(typeof action.payload === 'object' && Object.keys(action.payload).length === 0),
                email: (typeof action.payload === 'object' && Object.keys(action.payload).length === 0)?'':action.payload.email,
                name: (typeof action.payload === 'object' && Object.keys(action.payload).length === 0)?'':action.payload.name
            }

        default:
            return {
                ...state,
            };
    }
}