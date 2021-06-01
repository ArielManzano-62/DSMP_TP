import { combineReducers } from 'redux';
import albumReducer from './albumReducer'
import photoReducer from './photoReducer'

export default combineReducers({
    albums: albumReducer, 
    photos: photoReducer
})