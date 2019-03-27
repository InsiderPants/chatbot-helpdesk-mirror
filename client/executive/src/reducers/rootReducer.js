// This is the root reducer where we bring all other reducers
import {combineReducers} from 'redux';
import errorReducer from './errorReducer';
import resolutionReducer from './resolutionReducer';
import executiveReducer from './executiveReducer';
import executiveRegisterReducer from './executiveRegisterReducer';

export default combineReducers({
  chat: resolutionReducer,
  executive: executiveReducer, 
  executiveRegister: executiveRegisterReducer,
  errors: errorReducer
});