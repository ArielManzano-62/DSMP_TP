import axios from 'axios';
import { eventosEndpoint } from '../../api';

export const nuevoEvento = (evento) => {
    return {
        type: 'NUEVO_EVENTO',
        payload: evento
    };
}

const finalizarEvento = (evento) => {
    return { 
        type: 'FINALIZAR_EVENTO',
        payload: evento
    };
}

const resolverEvento = () => {
    return {
        type: 'RESOLVER_EVENTO'
    };
}

export const nuevoMensajeEvento = (mensaje) => {
    return {
        type: 'NUEVO_MENSAJE_EVENTO',
        payload: mensaje,
    }
}

export const enviarNuevoEvento = tipoEvento => async dispatch => {
    await axios.post(`${eventosEndpoint}/api/eventos`, { tipoEvento })
        .then((response) => dispatch(nuevoEvento(response.data)))
        .catch((err) => console.log(err.message));
}


export const enviarFinalizacionEvento = (codigo) => async dispatch => {
    await axios.post(`${eventosEndpoint}/api/eventos/finalizar`, {codigoFinalizacion: codigo})
        .then(response => { dispatch(finalizarEvento(response.data)); })
        .catch(err => {throw new Error(err.message)});
}

export const enviarResolucionEvento = (descripcion, estadofinal) => async dispatch => {
    await axios.post(`${eventosEndpoint}/api/eventos/resolver`, {descripcion, estadofinal})
        .then(response => dispatch(resolverEvento()))
        .catch(err => {throw new Error(err.message)});
}

//Mockeado, trae una lista de eventos que estan ocurriendo
export const fetchEventos = () => async dispatch => {
    await axios.get(`${eventosEndpoint}/api/eventos`)
        .then(response => dispatch({type: 'FETCH_EVENTOS', payload: response.data,}))
        .catch(err => {throw new Error(err.message)})    
};

export const fetchEvento = (eventoId) => async dispatch => {
    await axios.get(`${eventosEndpoint}/api/eventos/${eventoId}`)
        .then((response) => {
            dispatch({type: "FETCH_EVENTO", payload: response.data});
        })
        .catch(err => {throw new Error(err.message)});
}

export const updateEvent = (eventoId) => async dispatch => {
    await axios.get(`${eventosEndpoint}/api/eventos/${eventoId}`)
        .then((response) => {
            console.log("Mi data: ", response.data);
            dispatch({type: "UPDATE_EVENT", payload: response.data});
        })
        .catch(err => {throw new Error(err.message)});
}

//Cuando se selecciona un evento de la lista.
export const selectEvent = (eventoId) => (dispatch, getState) => {
    const evento = getState().listaEventos[eventoId];
    dispatch({
        type: 'EVENT_SELECTED',
        payload: evento
    })
}