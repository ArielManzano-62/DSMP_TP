export default photoReducer = (state = {
    list: [],
    isFetching: false
}, action) => {
    switch (action.type) {
        case 'IS_FETCHING_PHOTOS':
            return { ...state, list: [], isFetching: true };
        case 'FETCH_PHOTOS':
            return { ...state, list: action.payload, isFetching: false };
        default:
            return state;
    }
}
