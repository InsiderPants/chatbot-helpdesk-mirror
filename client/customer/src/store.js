import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import logger from 'redux-logger';


const store = createStore(rootReducer, applyMiddleware(ReduxThunk, logger));

export default store;