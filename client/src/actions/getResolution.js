import axios from 'axios';
import { GET_ERRORS, GET_AND_SAVE_USER_QUERY, GET_AND_SAVE_BOT_REPLY, SAVE_CHAT, LOADING_RESULTS } from './types';


export const getResolution = (data, dispatch) => {
	dispatch((dispatcher) => {
		dispatcher({type:LOADING_RESULTS});
		dispatcher({type:GET_AND_SAVE_USER_QUERY, payload:data.message});
		dispatcher({
			type:SAVE_CHAT,
			payload:{mtag:'CLIENT', message: data.message}
		});

		
		setTimeout(() => {
			axios.post('/api/getResolution', data)
				.then(res => {
					dispatcher({
						type:GET_AND_SAVE_BOT_REPLY,
						payload:res.data.reply
					});
					dispatcher({
						type:SAVE_CHAT,
						payload:{mtag:'SERVER',message:res.data.reply}
					});
				})
				.catch(err => 
					dispatcher({
						type:GET_ERRORS,
						payload:(err.response)?err.response.data:"Unknown Error Occured"})
				);

		},1000)
		
	});
}