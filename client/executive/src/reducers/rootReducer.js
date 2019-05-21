// This is the root reducer where we bring all other reducers
import {combineReducers} from 'redux';
import errorReducer from './errorReducer';
import resolutionReducer from './resolutionReducer';
import executiveProfileReducer from './executiveProfileReducer';

export default combineReducers({
  chat: resolutionReducer,
  executive: executiveProfileReducer,
  errors: errorReducer
});