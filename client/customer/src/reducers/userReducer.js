import {LOGIN_USER, SIGNOUT_USER, SWITCH_RESOLUTION_HANDLER} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    name: '',
    email: '',
    contact: '',
    accessToken: '',
    handler: 'BOT',
    apiEndPoint: '/api/chatbotGetResolution'
};

export default function(state=initialState, action){
    switch(action.type){
        case SWITCH_RESOLUTION_HANDLER:
			/*
				action.payload = handler-tag
            */
			return {
				...state,
                handler: action.payload === 'BOT'?'BOT':'HUMAN',
                apiEndPoint: action.payload === 'BOT'?'/api/chatbotGetResolution': '/api/executiveGetResolution'
			};
        case LOGIN_USER:
            /* 
                action.payload = {
                    name, email, contact, accessToken
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
                contact: '',
                accessToken: '',
                handler: 'BOT',
                apiEndPoint: '/api/chatbotGetResolution'
            };
        default:
            return {...state};
    }
}