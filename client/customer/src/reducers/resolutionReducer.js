import {GET_AND_SAVE_USER_QUERY, GET_AND_SAVE_BOT_REPLY, SAVE_CHAT, LOADING_RESULTS} from '../actions/types'

const initialState = {
  user: {},
  reply: {},
  conversation: [{mtag:'SERVER', message: 'Hi there! How can I help you?'}],
  isLoading: false
};

export default function(state=initialState,action){
	switch(action.type){
		case GET_AND_SAVE_USER_QUERY:
			return {
				...state,
				user:action.payload
			};
		case GET_AND_SAVE_BOT_REPLY:
			return {
				...state,
				reply:action.payload,
				isLoading:false
			};
		case SAVE_CHAT:
			if(state.conversation.length != 0){
				if(state.conversation[state.conversation.length-1].mtag === 'LOADING'){
					state.conversation.pop()
				}
			}

			state.conversation.push(action.payload)
			return {...state};
		case LOADING_RESULTS:
			state.conversation.push({mtag:'LOADING'})
			return {
				...state,
				isLoading:true
			};
		default:
			return state;
	}
}