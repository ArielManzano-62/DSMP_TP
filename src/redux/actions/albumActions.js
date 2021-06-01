import axios from 'axios'
import photoset from '../../api'

export const fetchAlbums = () => async dispatch => {
    dispatch({ type: "IS_FETCHING_ALBUMS"})
    try{
        const response = await axios.get( photoset.getAlbumEndpoint("getList") )
        dispatch({ type: "FETCH_ALBUMS", payload: response.data.photosets.photoset})
    }catch(e){

    }

}