export const updateLocation = ({latitude, longitude}) => {
    return {
        type: "UPDATE_LOCATION",
        payload: {latitude, longitude}
    }
}