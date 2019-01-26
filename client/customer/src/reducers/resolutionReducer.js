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
			/* 
                action.payload = user-message
            */
			return {
				...state,
				user:action.payload
			};
		case GET_AND_SAVE_BOT_REPLY:
			/* 
                action.payload = bot-reply
            */
			return {
				...state,
				reply:action.payload,
				isLoading:false
			};
		case RECIVE_PREVIOUS_CHAT:
			/* 
                action.payload = [{mtag, message}] 
            */

			// Cycle throught previous chats and add it to the conversation
			action.payload.forEach((conv, index) => {
				state.conversation.push(conv);
			});
			return {...state}
		case SAVE_CHAT:
			/* 
                action.payload = {mtag, message}
            */
			if(state.conversation.length !== 0){
				if(state.conversation[state.conversation.length-1].mtag === 'LOADING'){
					state.conversation.pop()
				}
			}

			state.conversation.push(action.payload)
			return {...state};
		case LOADING_RESULTS:
			/* 
                action.payload = undefined
            */
			state.conversation.push({mtag:'LOADING'})
			return {
				...state,
				isLoading:true
			};
		case SIGNOUT_USER:
			/* 
                action.payload = undefined
            */

			// Delete conversation on client side 
			state.conversation = [];
			return state;
		default:
			return state;
	}
}