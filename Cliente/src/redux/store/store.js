import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import reducers from '../reducers';
import { refreshToken, logger } from './Middlewares';


export default createStore(reducers, applyMiddleware(refreshToken, logger, thunk));