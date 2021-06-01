export default albumReducer = (state = {
    list: [],
    isFetching: false
}, action) => {
    switch (action.type) {
        case 'IS_FETCHING_ALBUMS':
            return {...state, list: [], isFetching: true}
        case 'FETCH_ALBUMS':
            return { ...state, list: action.payload, isFetching: false };
        default:
            return state;
    }
}
