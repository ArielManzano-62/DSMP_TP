import axios from 'axios';
import {auth0} from '../../api';
import { gruposEndpoint } from '../../api';

import { saveToken, storeToken} from './index';

const modificarPerfil = (metadata) => {
    return {
        type: 'MODIFICAR_PERFIL',
        payload: metadata,
    }
}



export const modificarDatosPerfil = metadata => async (dispatch, getState) => {
    await axios.post(`${gruposEndpoint}/api/usuarios`, {
        nombre: metadata.given_name ? metadata.given_name : '',
        apellido: metadata.family_name ? metadata.family_name : '',
    })
    .then(async () => {
        const refreshToken = getState().accessToken.token.refreshToken;
        const result = await auth0.auth.refreshToken({refreshToken, scope: 'openid profile email offline_access'});
        console.log(result);
        await dispatch(saveToken(result));
        await dispatch(storeToken(getState().accessToken.token));
        dispatch(modificarPerfil(metadata))
    })
    .catch((err) => { throw new Error(err) });
}

export const cambiarFotoPerfil = (uri, type, filename) => async (dispatch, getState) => {
    const data = new FormData();
    data.append('File', {
        uri: uri,
        type: type,
        name: filename
    });

    await axios.post(`${gruposEndpoint}/api/usuarios/picture`, data, {
        headers: {
            'Content-Type': 'application/form-data'
        }
      }).then(async (response) => {
        const refreshToken = getState().accessToken.token.refreshToken;
        const result = await auth0.auth.refreshToken({refreshToken, scope: 'openid profile email offline_access'});
        console.log(response.data);
        await dispatch(saveToken(result));
        await dispatch(storeToken(getState().accessToken.token));
        dispatch(modificarPerfil({ picture: response.data.picture}));
    })
}

export const cambiar_codigo_seguridad = (codigoActual, codigoNuevo) => async (dispatch) => {
    await axios.post(`${gruposEndpoint}/api/usuarios/codigo-seguridad`, {
        codigoAntiguo: codigoActual,
        codigoNuevo: codigoNuevo
    });
    dispatch({type: 'CAMBIAR_CODIGO'});
    
}


 
