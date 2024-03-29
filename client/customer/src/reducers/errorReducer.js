import {GET_ERRORS} from '../actions/types'

const initialState = {
  error: {}
};

export default function(state=initialState, action){
	switch(action.type){
		case GET_ERRORS:
			/* 
                action.payload = "Unknown Error Occured" || error Object
            */
			return {...state,
				error:action.payload
			};
		default:
			return state;
	}
}