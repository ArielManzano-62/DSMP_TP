const url = "https://api.flickr.com/services/rest"
const api_key = "6e8a597cb502b7b95dbd46a46e25db8d"
const user_id = "137290658%40N08"

const getAlbumEndpoint = (method) => `${url}/?method=flickr.photosets.${method}&api_key=${api_key}&user_id=${user_id}&format=json&nojsoncallback=1`
const getPhotosEndpoint = (method, albumId) => `${url}/?method=flickr.photosets.${method}&api_key=${api_key}&photoset_id=${albumId}&user_id=${user_id}&format=json&nojsoncallback=1`

export default photoset = {
    getAlbumEndpoint, getPhotosEndpoint
}