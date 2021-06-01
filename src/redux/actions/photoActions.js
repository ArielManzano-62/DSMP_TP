import axios from "axios"
import photoset from '../../api'

export const fetchPhotos = (albumId) => async dispatch => {
    dispatch({ type: 'IS_FETCHING_PHOTOS' })
    try{
        const response = await axios.get( photoset.getPhotosEndpoint("getPhotos", albumId) )
        dispatch({type: 'FETCH_PHOTOS', payload: response.data.photoset.photo})
    }catch(e){

    }
}