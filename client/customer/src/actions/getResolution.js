import axios from 'axios';
import { GET_ERRORS, GET_AND_SAVE_USER_QUERY, GET_AND_SAVE_BOT_REPLY, SAVE_CHAT, LOADING_RESULTS } from './types';

/**
 * 
 * @param {{message: String, accessToken: String}} data message from user
 * @param {Object} dispatch Action Dispatcher
 */
export const getResolution = (data, dispatch) => {
	dispatch((dispatcher) => {

		dispatcher({type:GET_AND_SAVE_USER_QUERY, payload:data.message});
		// Add the current message to conversation
		dispatcher({
			type:SAVE_CHAT,
			payload:{mtag:'CLIENT', message: data.message}
		});
		dispatcher({type:LOADING_RESULTS});

		
		setTimeout(() => {
			axios.post('/api/chatbotGetResolution', data)
				.then(res => {
					if(res.data.success){
						console.log(res.data.message);

						const { reply } = res.data.body;
						dispatcher({
							type:GET_AND_SAVE_BOT_REPLY,
							payload: reply
						});

						// Add Bot's reply to the conversation
						dispatcher({
							type:SAVE_CHAT,
							payload:{mtag:'SERVER',message: reply}
						});
					}
					else{
						console.log(res.data.message);
					}
					
				})
				.catch(err => 
					dispatcher({
						type: GET_ERRORS,
						payload: (err.response)?err.response.data:"Unknown Error Occured"})
				);

		},1500)
		
	});
}