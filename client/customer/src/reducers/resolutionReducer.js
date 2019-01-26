import {
	GET_AND_SAVE_USER_QUERY, 
	GET_AND_SAVE_BOT_REPLY, 
	SAVE_CHAT, LOADING_RESULTS, RECIVE_PREVIOUS_CHAT,
	SIGNOUT_USER
} from '../actions/types'

const initialState = {
  user: {},
  reply: {},
  conversation: [{mtag:'SERVER', message: "Hi there! I'm a chatbot, how can I help you today?"}],
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
		case RECIVE_PREVIOUS_CHAT:
			// Cycle throught previous chats and add it to the conversation
			action.payload.forEach((conv, index) => {
				state.conversation.push(conv);
			});
			return {...state}
		case SAVE_CHAT:
			if(state.conversation.length !== 0){
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
		case SIGNOUT_USER:
			// Delete conversation on client side 
			state.conversation = [];
			return state;
		default:
			return state;
	}
}