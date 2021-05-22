import _ from 'lodash';

export const rutaReducer = (state = {
    isInSeguimiento: false,
    seguimiento: {},
    modo: 'DRIVING', 
    waypoints: [],
    grupoIds: [],
    ruta: [],
    page: 1
}, action) => {
    switch(action.type){
        case 'CARGAR_RUTA':
            return {...state, ruta: action.payload}
        case 'CHANGE_MODE':
            return {...state, modo: action.payload}
        case 'CHANGE_ORIGIN':
            return {...state, origen: action.payload}
        case 'CHANGE_DESTINATION':            
            return {...state, destino: action.payload}
        case 'CARGAR_DIRECCION_DESTINO':
            return {...state, direccionDestino: action.payload}
        case 'ADD_WAYPOINT':
            return {...state, waypoints: [...state.waypoints, action.payload]}
        case 'REMOVE_WAYPOINT':
            return {...state, waypoints: state.waypoints.filter(w => {
                if (w.latitude == action.payload.latitude && w.longitude == action.payload.longitude)
                    return false;
                return true;
            })}
        case 'ADD_GROUP_SEGUIMIENTO':
            return {...state, grupoIds: [...state.grupoIds, action.payload]}
        case 'REMOVE_GROUP_SEGUIMIENTO':
            return {...state, grupoIds: _.filter(state.grupoIds, function(e) { return e != action.payload})}
        case 'INICIAR_SEGUIMIENTO':
            return {...state, isInSeguimiento: true, seguimiento: action.payload };
        case 'CHANGE_PAGE_SEGUIMIENTO':
            return {...state, page: state.page + action.payload};
        case 'DESVIAR':
            return state.isInSeguimiento ? {...state, seguimiento: {...state.seguimiento, estado: 'Desviado'}} : state;
        case 'ENCURSAR':
            return state.isInSeguimiento ? {...state, seguimiento: {...state.seguimiento, estado: 'En Curso'}} : state;
        case 'ACTUALIZAR_UBICACION':
            if (!state.isInSeguimiento) return state;
            return {...state, seguimiento:{...state.seguimiento, ubicaciones: [...state.seguimiento.ubicaciones, action.payload]}}
        case 'REINICIAR_RUTA':
            return {
                isInSeguimiento: false,
                seguimiento: {},
                modo: 'DRIVING', 
                waypoints: [],
                grupoIds: [],
                ruta: [],
                page: 1
            }
        case 'FINALIZAR_SEGUIMIENTO':
            return {
                isInSeguimiento: false,
                seguimiento: {},
                modo: 'DRIVING', 
                waypoints: [],
                grupoIds: [],
                ruta: [],
                page: 1
            }
        default:
            return state;
    }
}

export const listaSeguimientosReducer = (listaSeguimientos = {}, action) => {
    switch (action.type) {
        case 'FETCH_SEGUIMIENTOS':
            return { ..._.mapKeys(action.payload, 'id') };
        case 'FETCH_SEGUIMIENTO':
            return { ...listaSeguimientos, [action.payload.id]: action.payload };
        case 'REMOVE_SEGUIMIENTO':
            //action.payload es el id del seguimiento en este caso
            return _.omit(listaSeguimientos, action.payload)
        default:
            return listaSeguimientos;
    }
}

export const seguimientoSeleccionadoReducer = (seleccionado = {}, action) => {
    switch (action.type) {
        case 'SELECCIONAR_SEGUIMIENTO':
            return action.payload;
        case 'ACTUALIZAR_UBICACION_SEGUIMIENTO_SELECCIONADO':
            return {...seleccionado, ubicaciones: [...seleccionado.ubicaciones, action.payload]};
        case 'FETCH_SEGUIMIENTO':
            if (seleccionado.id === action.payload.id) return action.payload;
        default:
            return seleccionado;
    }
}