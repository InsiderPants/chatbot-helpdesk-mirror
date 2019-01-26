// This is the root reducer where we bring all other reducers
import {combineReducers} from 'redux';
import resolutionReducer from './resolutionReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer';

export default combineReducers({
  chat: resolutionReducer,
  errors: errorReducer,
  userInfo: userReducer
});