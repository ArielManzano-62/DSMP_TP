export const spinnerReducer = (state= {loading: false}, action) => {
    switch(action.type){
        case 'UPDATE_SPINNER':
            return {loading: action.payload};
        default: 
            return state;
    }
}