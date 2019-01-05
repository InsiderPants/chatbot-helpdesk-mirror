import axios from 'axios';
import { GET_ERRORS, GET_RESOLUTION, LOADING_RESULTS } from './types';

export const getResults = (data)=>(dispatch)=>{
	dispatch({type:LOADING_RESULTS});
	axios.post('/api/getResolution', data)
		.then(res => {
			dispatch({
				type:GET_RESOLUTION,
				payload:res.data})
		})
		.catch(err => 
			dispatch({
				type:GET_ERRORS,
				payload:err.response.data})
		);
}