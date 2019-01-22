import axios from 'axios';
import { GET_ERRORS, GET_AND_SAVE_USER_QUERY, GET_AND_SAVE_BOT_REPLY, SAVE_CHAT, LOADING_RESULTS } from './types';

export const getResolution = (data) => (dispatch) => {
	dispatch({type:LOADING_RESULTS});
	dispatch({type:GET_AND_SAVE_USER_QUERY,payload:data.text});
	axios.post('/api/getResolution', data)
		.then(res => {
			dispatch({
				type:GET_AND_SAVE_BOT_REPLY,
				payload:res.data.reply});
			dispatch({
				type:SAVE_CHAT,
				payload:{user:data.text,reply:res.data.reply}});
		})
		.catch(err => 
			dispatch({
				type:GET_ERRORS,
				payload:(err.response)?err.response.data:"Unknown Error Occured"})
		);
}