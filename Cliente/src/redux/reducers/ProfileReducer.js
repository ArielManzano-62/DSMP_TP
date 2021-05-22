import jwtDecode from 'jwt-decode';

const ProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SAVE_TOKEN':
            const id = jwtDecode(action.payload.idToken);
            return id;
        case 'REMOVE_TOKEN':
            return {};
        case 'MODIFICAR_PERFIL':
            var newState = { ...state}
            const oldStateMetadata = state['http://closely.com/user_metadata']
            newState['http://closely.com/user_metadata'] = { ...oldStateMetadata, ...action.payload }
            return newState;
        case 'ERROR':
            return {...state};
        default:
            return state;
    }
};

export default ProfileReducer;