export const setStateSpinner = (state) => {
    return {
        type:'UPDATE_SPINNER',
        payload: state,
    }
}