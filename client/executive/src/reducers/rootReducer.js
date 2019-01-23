// This is the root reducer where we bring all other reducers
import {combineReducers} from 'redux';
import errorReducer from './errorReducer';

export default combineReducers({
  errors: errorReducer
});