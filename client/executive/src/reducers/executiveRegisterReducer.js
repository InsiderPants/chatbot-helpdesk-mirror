import { REGISTER_EXECUTIVE } from '../actions/types';

const initialState = {
    name: '',
    contact: '',
    email: '',
    password: '',
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REGISTER_EXECUTIVE:
            return {
                ...state,
                ...action.payload
            };

        default:
            return {
                ...state,
            };
    }
}