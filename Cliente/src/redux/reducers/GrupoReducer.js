import _ from 'lodash';


export const listaGruposReducer = (state = {}, action) => {
    switch(action.type){
        case 'NUEVO_GRUPO': 
            return {...state, [action.payload.grupoId]: action.payload}
        case 'OBTENER_LISTA_GRUPOS':
            return { ..._.mapKeys(action.payload, 'grupoId') };
        case 'UPDATE_GRUPO':
            return {...state, [action.payload.grupoId]: action.payload}
        case 'NUEVO_MENSAJE':
            const grupoId = action.payload.grupoId;
            return {...state, [grupoId]: {...state[grupoId], historialMensajes: [action.payload, ...state[grupoId].historialMensajes]}};
        case 'ABANDONAR_GRUPO':
            return _.omit(state, action.payload)
        case 'ELIMINAR_GRUPO':
            return _.omit(state, action.payload);
        default : 
            return state
    }
}

export const grupoSeleccionadoReducer = (state = null, action) =>{
    switch(action.type){
        case 'SELECCIONAR_GRUPO':
            return action.payload;
        case 'NUEVO_MENSAJE':
            if (state !== null && state.grupoId === action.payload.grupoId) {
                return { ...state, historialMensajes: [action.payload, ...state.historialMensajes]}
            }
            return state;
        case 'DESELECCIONAR_GRUPO':
            return null;
        case 'ELIMINAR_GRUPO':
            if (state !== null && state.grupoId === action.payload) return {...state, eliminado: true}
        case 'UPDATE_GRUPO': 
            return state && state.grupoId === action.payload.grupoId ? action.payload : state;
        case 'ABANDONAR_GRUPO':
            return null;
        default :
            return state
    }
}

export const mensajesLeidosReducer = (mensajesLeidos = {}, action) => {
    switch (action.type) {
        case 'LEER_MENSAJE': {
            return { ...mensajesLeidos, [action.payload.grupoId]: action.payload.nroMensaje}
        }
        case 'NUEVO_GRUPO': {
            return {...mensajesLeidos, [action.payload.grupoId]: 0}
        }
        case 'UPDATE_GRUPO': {
            if (!_.has(mensajesLeidos, action.payload.grupoId)) 
                return {...mensajesLeidos, [action.payload.grupoId]: action.payload.historialMensajes.length > 0 ? action.payload.historialMensajes[0].nroMensaje : 0}
            return mensajesLeidos;
        }
        
        case 'OBTENER_LISTA_GRUPOS': {
            const nuevosMensajesLeidos = {}
            action.payload.forEach(e => {
                if (_.has(mensajesLeidos, e.grupoId)) nuevosMensajesLeidos[e.grupoId] = mensajesLeidos[e.grupoId];
                else {
                    if (e.historialMensajes.length > 0)
                        nuevosMensajesLeidos[e.grupoId] = e.historialMensajes[0].nroMensaje;
                    else
                        nuevosMensajesLeidos[e.grupoId] = 0;
                }
            })
            return nuevosMensajesLeidos;
        }
        case 'ELIMINAR_GRUPO': {
            return _.omit(mensajesLeidos, action.payload);
        }
        case 'SELECCIONAR_GRUPO': {
            return {...mensajesLeidos, [action.payload.grupoId]: action.payload.historialMensajes.length > 0 ? action.payload.historialMensajes[0].nroMensaje : 0}
        }
        case 'ABANDONAR_GRUPO': {
            return _.omit(mensajesLeidos, action.payload);
        }
        default:
            return mensajesLeidos;
    }
}
