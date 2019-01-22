import {GET_AND_SAVE_USER_QUERY, GET_AND_SAVE_BOT_REPLY, SAVE_CHAT, LOADING_RESULTS} from '../actions/types'

const initialState = {
  user: {},
  reply: {},
  conversation: [],
  isLoading: false
};

export default function(state=initialState,action){
  switch(action.type){
    case GET_AND_SAVE_USER_QUERY:
      return {...state,
      		user:action.payload
      	};
    case GET_AND_SAVE_BOT_REPLY:
      return {...state,
          reply:action.payload,
          isLoading:false
        };
    case SAVE_CHAT:
      state.conversation.push(action.payload)
      return {...state
        };
    case LOADING_RESULTS:
      return {...state,
          isLoading:true
        };
    default:
      return state;
  }
}