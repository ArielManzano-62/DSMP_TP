import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { gruposEndpoint, eventosEndpoint } from '../../api';



const nuevoGrupo = (grupo) => {
    return {
        type: 'NUEVO_GRUPO',
        payload: grupo,
    }
}

const actualizarGrupo = (grupo) => {
    return {
        type: 'UPDATE_GRUPO',
        payload: grupo
    };
}

const abandonar = (grupoId) => {
    return {
        type: 'ABANDONAR_GRUPO',
        payload: grupoId
    }
}

const listaGrupos = (listGrupos) => {
    return {
        type: 'OBTENER_LISTA_GRUPOS',
        payload: listGrupos
    }
}

export const nuevoMensaje = (mensaje) => (dispatch, getState) => {
    const grupoSeleccionado = getState().grupoSeleccionado;
    if (grupoSeleccionado && grupoSeleccionado.grupoId === mensaje.grupoId) {
        dispatch(leerMensaje(mensaje));
    }
    dispatch({
        type: 'NUEVO_MENSAJE',
        payload: mensaje
    });
}

export const selectGrupo = (grupo) => {
    return {
        type: 'SELECCIONAR_GRUPO',
        payload: grupo
    }
}

export const eliminarGrupo = (grupoId) => {
    return {
        type: 'ELIMINAR_GRUPO',
        payload: grupoId,
    }
}

export const deseleccionarGrupo = () => {
    return {
        type: 'DESELECCIONAR_GRUPO',
    }
}

export const leerMensaje = (registroMensaje) => {
    return {
        type: 'LEER_MENSAJE',
        payload: registroMensaje,
    }
}

export const seleccionarGrupo = (grupoId) => (dispatch, getState) => {
    const grupo = getState().listaGrupos[grupoId];    
    dispatch(selectGrupo(grupo));
}

export const crearGrupo = (grupo) => async dispatch => {
    const data = new FormData();
    if (grupo.picture) {
        data.append('File', {
            uri: grupo.picture.uri,
            type: grupo.picture.type,
            name: grupo.picture.fileName
        });
    }
    
    data.append('GrupoNombre', grupo.grupoNombre);
    data.append('UsuariosId', JSON.stringify(grupo.usuariosId));
    await axios.post(`${gruposEndpoint}/api/grupos`, data, {
        headers: {
            'Content-Type': 'application/form-data'
        }
    })
    .then(response => dispatch(nuevoGrupo(response.data)))
    .catch(err => {throw new Error(err.message)})
}

export const cambiar_foto_grupo = (uri, type, fileName, grupoId) => async dispatch => {
    const data = new FormData();
    data.append('File', {
        uri,
        type,
        name: fileName
    });    
    data.append('GrupoId', grupoId);
    const response = await axios.post(`${gruposEndpoint}/api/grupos/cambiar-foto`, data, {
        headers: {
            'Content-Type': 'application/form-data'
        }
    });
    dispatch(actualizarGrupo(response.data));
}


export const getListaGrupos = () => async dispatch => {
    await axios.get(`${gruposEndpoint}/api/grupos`)
    .then(response => dispatch(listaGrupos(response.data)))
    .catch(err => {throw new Error(err.message); console.log(err.message)})
}

export const updateGrupo = (grupoId) => async dispatch => {
    await axios.get(`${gruposEndpoint}/api/grupos/${grupoId}`)
    .then(response => dispatch(actualizarGrupo(response.data)))
    .catch(err => {throw new Error(err.message)})
}


export const agregar_integrantes = (grupoId, usuariosIds) => async dispatch => {
    const response = await axios.post(`${gruposEndpoint}/api/grupos/agregar-integrantes`, {
        grupoId,
        usuariosIds
    });
    dispatch(actualizarGrupo(response.data));
}

export const abandonarGrupo = (grupoId, usuarioId) => async dispatch => {
    await axios.post(`${gruposEndpoint}/api/grupos/integrantes`, {grupoId, usuarioId})
    .then(() => dispatch(abandonar(grupoId)))
    .catch(err => {throw new Error(err.message)});
}

export const eliminar_integrante = (grupoId, usuarioId) => async dispatch => {
    const response = await axios.post(`${gruposEndpoint}/api/grupos/eliminar-integrante`, {grupoId, usuarioId})
    dispatch(actualizarGrupo(response.data));
}