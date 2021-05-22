const locationReducer = (location = { longitude: -64.269660, latitude: -31.349530, }, action) => {
    switch(action.type){
        case "UPDATE_LOCATION": return action.payload;
        
        default : return location;
    }
}

export default locationReducer