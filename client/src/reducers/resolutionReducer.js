import {GET_RESOLUTION,LOADING_RESULTS} from '../actions/types'

const initialState = {
  reply: {},
  isLoading: false
};

export default function(state=initialState,action){
  switch(action.type){
    case GET_RESOLUTION:
      return {...state,
      		reply:action.payload,
          isLoading:false
      	};
    case LOADING_RESULTS:
      return {...state,
          isLoading:true
        };
    default:
      return state;
  }
}