import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import logger from 'redux-logger';
import { compose } from 'redux';



const store = createStore(
    rootReducer, 
    compose(
        applyMiddleware(ReduxThunk, logger),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)
export default store;