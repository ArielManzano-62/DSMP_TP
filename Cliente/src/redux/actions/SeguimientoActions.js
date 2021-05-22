import axios from 'axios';
import { eventosEndpoint } from '../../api';
import { seguimientoSeleccionadoReducer } from '../reducers/SeguimientoReducer';

export const cargar_ruta = (ruta) => {
    return{
        type:'CARGAR_RUTA',
        payload: ruta
    }
}

export const change_mode = (mode) => {
    return {
        type: 'CHANGE_MODE',
        payload: mode
    }
}

export const change_origin = (origin) => {
    return {
        type: 'CHANGE_ORIGIN',
        payload: origin
    }
}

export const change_destination = (destination) => {
    return {
        type: 'CHANGE_DESTINATION',
        payload: destination
    }
}

export const add_waypoint = (waypoint) => {
    return {
        type: 'ADD_WAYPOINT',
        payload: waypoint
    }
}

export const remove_waypoint = (waypoint) => {
    return {
        type: 'REMOVE_WAYPOINT',
        payload: waypoint
    };
}

export const add_group_seguimiento = (groupId) => {
    return {
        type: 'ADD_GROUP_SEGUIMIENTO',
        payload: groupId
    }
}

export const remove_group_seguimiento = (grupoId) => {
    return {
        type: 'REMOVE_GROUP_SEGUIMIENTO',
        payload: grupoId
    }
}


export const next_page_seguimiento = () => {
    return {
        type: 'CHANGE_PAGE_SEGUIMIENTO',
        payload: 1
    }
}

export const previous_page_seguimiento = () => {
    return {
        type: 'CHANGE_PAGE_SEGUIMIENTO',
        payload: -1
    }
}

export const cargar_direccion_destino = (direccion) => {
    return {
        type: 'CARGAR_DIRECCION_DESTINO',
        payload: direccion,
    }
}

export const reiniciar_ruta = () => {
    return {
        type: 'REINICIAR_RUTA'
    }
}

export const actualizar_ubicacion_seguimiento_seleccionado = ubicacion => {
    return {
        type: 'ACTUALIZAR_UBICACION_SEGUIMIENTO_SELECCIONADO',
        payload: ubicacion
    }
}

export const actualizar_ubicacion = ubicacion => {
    return {
        type: 'ACTUALIZAR_UBICACION',
        payload: ubicacion
    }
}

export const desviar = () => {
    return {
        type: 'DESVIAR'
    }
}

export const encursar = () => {
    return {
        type: 'ENCURSAR'
    }
}
export const seleccionar_seguimiento = (seguimientoId) => (dispatch, getState) => {
    const seguimientoSeleccionado = getState().listaSeguimientos[seguimientoId];
    dispatch({type: 'SELECCIONAR_SEGUIMIENTO', payload: seguimientoSeleccionado});
}

export const iniciar_seguimiento = () => async (dispatch, getState) => { 
    const { ruta } = getState();  
    
    const request = {
        destino: ruta.destino, 
        origen: ruta.origen,
        waypoints: ruta.waypoints,
        modo: ruta.modo,
        grupoIds: ruta.grupoIds,
        encodedPolyline: ruta.ruta,
        direccionDestino: ruta.direccionDestino
    };

    try {
        const response = await axios.post(`${eventosEndpoint}/api/seguimientos`, request);
        dispatch({
            type: 'INICIAR_SEGUIMIENTO',
            payload: response.data,
        });
    } 
    catch (error) {
        console.log(error);
    }
}

export const fetch_seguimientos = () => async dispatch => {
    try {
        const response = await axios.get(`${eventosEndpoint}/api/seguimientos`);
        dispatch({ type: 'FETCH_SEGUIMIENTOS', payload: response.data })
    } catch (error) {
        console.log(error);
    }
}

export const fetch_seguimiento = (seguimientoId) => async dispatch => {
    try {
        const response = await axios.get(`${eventosEndpoint}/api/seguimientos/${seguimientoId}`);
        dispatch({ type: 'FETCH_SEGUIMIENTO', payload: response.data });
    } catch (error) {
        console.log(error);
    }
}

export const finalizar_seguimiento = (codigo, seguimientoId) => async dispatch => {
    const response = await axios.post(`${eventosEndpoint}/api/seguimientos/finalizar`, {seguimientoId, codigo});
    dispatch({ type: 'FINALIZAR_SEGUIMIENTO'});
}

export const finalizar_automaticamente = () => {
    return {
        type: 'FINALIZAR_SEGUIMIENTO'
    }
}
