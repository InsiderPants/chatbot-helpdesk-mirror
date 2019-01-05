// This is the root reducer where we bring all other reducers
import {combineReducers} from 'redux';
import resolutionReducer from './resolutionReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  resolution: resolutionReducer,
  errors: errorReducer,
});