import axios from 'axios';
import { GET_ERRORS, GET_AND_SAVE_USER_QUERY,
	GET_AND_SAVE_BOT_REPLY, SAVE_CHAT,
	LOADING_RESULTS, SWITCH_RESOLUTION_HANDLER
} from './types';

/**
 * 
 * @param {{message: String, accessToken: String, apiEndPoint: String}} data message from user
 * @param {Object} dispatch Action Dispatcher
 */
export const getResolution = (data, dispatch) => {
	const {message, accessToken, apiEndPoint} = data;

	dispatch((dispatcher) => {

		dispatcher({type:GET_AND_SAVE_USER_QUERY, payload:data.message});
		// Add the current message to conversation
		dispatcher({
			type:SAVE_CHAT,
			payload:{mtag:'CLIENT', message: data.message}
		});
		dispatcher({type:LOADING_RESULTS});

		
		setTimeout(() => {
			axios.post(apiEndPoint, {message, accessToken})
				.then(res => {
					if(res.data.success){
						console.log(res.data.message);
						/*
							*sentiment - numeric b/w 1 and 0
							*intent - string representating the intent
							*confidence - confidence score b/w 1 and 0 for intent
							*entities - Array containing entities
							*reply - Array containing replies
							*actions - Array containing actions
						*/
						const { sentiment, intent, confidence, entities, reply, actions } = res.data.response;
						dispatcher({
							type:GET_AND_SAVE_BOT_REPLY,
							payload: reply
						});

						// Add Bot's reply to the conversation
						reply.forEach((str)=>{
							// str is string item from reply array
							dispatcher({
								type:SAVE_CHAT,
								payload:{mtag:'SERVER',message: str}
							});
						})
					}
					else{
						// Log the error message
						console.log(res.data.message);
					}
					
				})
				.catch(err => 
					dispatcher({
						type: GET_ERRORS,
						payload: (err.response)?err.response.data:"Unknown Error Occured"
					})
				);

		},1500)
		
	});
}

/**
 * 
 * @param {{handlerTag: String}} data reciver tag
 * @param {Object} dispatch 
 */
export const switchMessageHandler = (data, dispatch) => {
	dispatch({
		type: SWITCH_RESOLUTION_HANDLER,
		payload: data.handlerTag
	})

	return {
		success: true,
		message: 'Now you are connected to our human executive'
	};
};