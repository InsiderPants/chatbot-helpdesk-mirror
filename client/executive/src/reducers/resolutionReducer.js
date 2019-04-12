import { GET_USER_QUERY_FROM_BACKEND, GET_EXECUTIVE_ANSWER, SAVE_CHAT, LOADING_QUERY } from '../actions/types';

const initialState = {
    user_query: {},
    executive_reply: {},
    conversation: [],
    isLoading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_QUERY_FROM_BACKEND:
            return {
                ...state,
                user_query: action.payload,
                isLoading: false,
            };

        case GET_EXECUTIVE_ANSWER:
            return {
                ...state,
                executive_reply: action.payload,
            };
        
        case SAVE_CHAT:
            if(state.conversation.length !== 0) {
                if (state.conversation[state.conversation.length - 1].tag === 'loading') {
                    state.conversation.pop()
                }
            }
            state.conversation.push(action.payload)
            return { ...state
            };

        case LOADING_QUERY:
            state.conversation.push({
                tag: 'loading'
            })
            return {
                ...state,
                isLoading: true
            };

        default:
            return state;
    }
}