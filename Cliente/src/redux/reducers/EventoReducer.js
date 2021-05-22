import _ from 'lodash';

export const EventoReducer = (state = {
    isInEvent: false,
    evento: {}
}, action) => {
    switch (action.type) {
        case 'NUEVO_EVENTO':
            return { ...state, evento: action.payload, isInEvent: true };
        case 'FINALIZAR_EVENTO':
            return { ...state, evento: action.payload };
        case 'RESOLVER_EVENTO':
            return { ...state, evento: {}, isInEvent: false};
        case 'NUEVO_MENSAJE_EVENTO':
            if (!state.isInEvent || state.evento.eventoId != action.payload.eventoId) return state;
            const msg = [action.payload, ...state.evento.mensajes]
            const evento = {...state.evento, mensajes: msg}
            return {...state, evento: evento}
        default:
            return state;
    }
}

export const eventsReducer = (listEventos = {}, action) => {
    if (action.type === 'FETCH_EVENTOS') {
        return { ..._.mapKeys(action.payload, 'id') };;
    }
    if (action.type === 'FETCH_EVENTO') {
        return {...listEventos, [action.payload.id]: action.payload};
    }
    if (action.type === 'UPDATE_EVENT') {
        return {...listEventos, [action.payload.id]: action.payload};
    }
    if (action.type === 'NUEVO_MENSAJE_EVENTO') {
        if (!_.has(listEventos, action.payload.eventoId)) return listEventos;
        return {...listEventos, [action.payload.eventoId]: {...listEventos[action.payload.eventoId], mensajes: [action.payload, ...listEventos[action.payload.eventoId].mensajes]}}
    }
    return listEventos;
}


export const selectedEventReducer = (state = {}, action) => {
    if (action.type === 'EVENT_SELECTED'){
        return action.payload;
    }
    if (action.type === 'NUEVO_MENSAJE_EVENTO') { 
        if (!_.isEmpty(state) && state.id === action.payload.eventoId) {
            const msg = [action.payload, ...state.mensajes]
            return {...state, mensajes: msg}
        }
        return state;      
        
    }
    if (action.type === 'UPDATE_EVENT') {
        if (!_.isEmpty(state) && state.id === action.payload.id) return action.payload;        
    }
    return state;
}
