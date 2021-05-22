import moment from 'moment-with-locales-es6';
import calendarConfig from '../../constants/calendarConfig';


export default function notificationAnalyzer(accion, notificacion, props) {
  moment.locale('es');
    var header = '';
    var title = '';
    var description = '';
    var foto = '';
    var hora = '';
    var icon = 'fire';
    var color = 'red';
    switch(accion){
        case 'NUEVO_EVENTO':{
          props.fetchEvento(notificacion.Id);
          header = `Nueva alerta: ${notificacion.TipoEvento}`;
          title = `¡${notificacion.Nombre} necesita ayuda!` ;
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          description = undefined;
          foto = notificacion.Foto
          switch(notificacion.TipoEvento){
            case('Asalto'): icon='pistol'; break;
            case('Emergencia Medica'): icon='medical-bag'; break;
            case('Incendio'): icon="fire"; break;
            default: icon='pistol'; break;
          }
          //El ONPRESS debe llamar al action  selectEvent(eventoId) y navegar a la pantalla.
          break;
        }
        case 'FIN_EVENTO':{
          header = `Ha finalizado una alerta: ${notificacion.TipoEvento}`;
          title = `¡${notificacion.Nombre} ya esta bien!` ;
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          foto = notificacion.Foto
          description = undefined;
          color = 'green'
          switch(notificacion.TipoEvento){
            case('Asalto'): icon='pistol'; break;
            case('Emergencia Medica'): icon='medical-bag'; break;
            case('Incendio'): icon="fire"; break;
            default: icon='fire'; break;
          }
          props.fetchEventos();
          break;
        }
        case 'NUEVO_MENSAJE': {
          props.nuevoMensaje(JSON.parse(notificacion.Mensaje));
          break;
        }
        case 'NUEVO_GRUPO': {
          header = 'Ha sido agregado a un nuevo grupo';
          title = `Nombre de grupo: ${notificacion.Nombre}`;
          description = undefined;
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          foto = notificacion.Foto;
          icon = undefined;
          color = 'green';
          props.updateGrupo(notificacion.Id);
          break;
        }
        case 'ELIMINAR_INTEGRANTE': {
          header = 'Ha sido eliminado de un grupo';
          title = `Nombre de grupo: ${notificacion.Nombre}`;
          description = undefined;
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          foto = notificacion.Foto;
          icon = undefined;
          props.eliminarGrupo(notificacion.Id); 
          break;
        }
        case 'NUEVO_SEGUIMIENTO': {
          header = `Nueva solicitud de seguimiento`;
          title = `${notificacion.Nombre}`;
          description = `${notificacion.Destino}`;
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          foto = notificacion.Foto;
          icon = undefined;
          props.fetch_seguimiento(notificacion.Id);
          break;
        }
        case 'FIN_SEGUIMIENTO': {
          header = `Ha finalizado una solicitud de seguimiento`;
          if (notificacion.Modo === 'manual')
            title = `¡${notificacion.Nombre} ha finalizado el seguimiento!`
          else
            title = `¡${notificacion.Nombre} ha llegado a su destino!`
          description = `${notificacion.Destino}`;
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          foto = notificacion.Foto;
          icon = undefined;
          color = 'green'
          props.fetch_seguimientos();
          break;
        }
        case 'DESVIO_SEGUIMIENTO':
          header = `Alerta en seguimiento`;
          title = `¡${notificacion.Nombre} se ha desviado de su camino!`
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          foto = notificacion.Foto;
          icon = undefined;
          description = undefined
          props.fetch_seguimiento(notificacion.Id);
          break;
        case 'ENCURSAR_SEGUIMIENTO':
          header = `Alerta de seguimiento`;
          title = `¡${notificacion.Nombre} ha vuelto a su recorrido!`
          hora = `${moment(notificacion.FechaHora).calendar(null, calendarConfig)}`;
          foto = notificacion.Foto;
          icon = undefined;
          description = undefined
          color = 'green';
          props.fetch_seguimiento(notificacion.Id);
          break;
        default:{
          header = '';
          title = '';
          description = '';
          icon = 'fire';
        }
      }
      return ({header, title, description, hora, foto, icon, type: accion, color});
}