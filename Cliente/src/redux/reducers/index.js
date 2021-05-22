import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import {EventoReducer, eventsReducer, selectedEventReducer} from './EventoReducer';
import NotificationReducer from './NotificationReducer';
import {grupoSeleccionadoReducer, listaGruposReducer, mensajesLeidosReducer} from './GrupoReducer';
import {spinnerReducer} from './SpinnerReducer'
import ProfileReducer from './ProfileReducer';
import {rutaReducer, listaSeguimientosReducer, seguimientoSeleccionadoReducer} from './SeguimientoReducer'

export default combineReducers({
    accessToken: AuthReducer,
    evento: EventoReducer,
    listaEventos: eventsReducer,
    eventoSeleccionado: selectedEventReducer,
    notificationList: NotificationReducer,
    listaGrupos : listaGruposReducer,
    grupoSeleccionado: grupoSeleccionadoReducer,
    spinner: spinnerReducer,
    profile: ProfileReducer,
    ruta: rutaReducer,
    mensajesLeidos: mensajesLeidosReducer,
    listaSeguimientos: listaSeguimientosReducer,
    seguimientoSeleccionado: seguimientoSeleccionadoReducer,
});