import jwtDecode from 'jwt-decode';

const AuthReducer = (state = {
    isSignedIn: false,
    token: {},
    expirationDate: null,
    error: null
}, action) => {
    switch (action.type) {
        case 'SAVE_TOKEN':
            const expirationDate = jwtDecode(action.payload.accessToken).exp;
            return {...state, token: {...state.token, ...action.payload }, isSignedIn: true, expirationDate, error: null};
        case 'REMOVE_TOKEN':
            return {...state, token: {}, isSignedIn: false, expirationDate: null, error: null};
        case 'ERROR':
            return {...state, error: action.payload};
        default:
            return state;
    }
};

export default AuthReducer;