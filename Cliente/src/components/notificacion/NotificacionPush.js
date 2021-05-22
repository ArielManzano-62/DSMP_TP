import React from 'react';
import {FlatList} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux'

import {updateEvent, getUserToken, getListaGrupos, nuevoMensaje, seleccionarGrupo, updateGrupo, fetchEventos, fetchEvento, selectEvent, newNotification, eliminarGrupo, removeNotification, fetch_seguimientos, fetch_seguimiento, seleccionar_seguimiento} from '../../redux/actions';
import Animacion from './Animacion'
import {PopUp} from './PopUpPanico';
import notificationAnalyzer from './notificationAnalyzer';
import { NavigationActions } from 'react-navigation';

//Clase contenedora de una notificacion push cuando la app esta en primer plano.
class NotificacionPush extends React.Component{
  state = {id: 0}
  
  componentDidMount() {
    firebase.notifications().getInitialNotification().then(async (notificationOpen)=> {
      console.log("NOTIF INICIAL")
      await this.props.getUserToken();
      if(notificationOpen){
        console.log("onNotificationOpen - ",notificationOpen);
        if(notificationOpen.action == "NUEVO_EVENTO"){
          await this.props.fetchEventos();
          this.props.selectEvent(notificationOpen.notification.data.Id);
          this.props.onPress({routeName: 'DetalleAlerta'});
        }
        if (notificationOpen.action == 'NUEVO_MENSAJE' || notificationOpen.action == 'NUEVO_GRUPO') {
          await this.props.getListaGrupos();
          this.props.seleccionarGrupo(notificationOpen.notification.data.Id);
          this.props.onPress({routeName: 'GrupoSeleccionado'});
        }
        if (notificationOpen.action == "NUEVO_SEGUIMIENTO" || notificationOpen.action == "DESVIO_SEGUIMIENTO" || notificationOpen.action == "ENCURSAR_SEGUIMIENTO") {
          await this.props.fetch_seguimientos();
          this.props.seleccionar_seguimiento(notificationOpen.notification.data.Id);
          this.props.onPress({routeName: 'DetalleSeguimiento'});
        }
      }
    });

    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed(notification => {
    })

    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened(async (notificationOpen) => {
      await this.props.getUserToken();
      console.log("SUCEDEN COSAS HNO");
      if(notificationOpen){
        if(notificationOpen.action == "NUEVO_EVENTO"){
          await this.props.fetchEventos();
          this.props.selectEvent(notificationOpen.notification.data.Id);
          this.props.onPress({routeName: 'DetalleAlerta'});
        }
        if (notificationOpen.action == 'NUEVO_MENSAJE' || notificationOpen.action == 'NUEVO_GRUPO') {
          await this.props.getListaGrupos();
          this.props.seleccionarGrupo(notificationOpen.notification.data.Id);
          this.props.onPress({routeName: 'GrupoSeleccionado'});

        }
        if (notificationOpen.action == "NUEVO_SEGUIMIENTO" || notificationOpen.action == "DESVIO_SEGUIMIENTO" || notificationOpen.action == "ENCURSAR_SEGUIMIENTO") {
          await this.props.fetch_seguimientos();
          this.props.seleccionar_seguimiento(notificationOpen.notification.data.Id);
          this.props.onPress({routeName: 'DetalleSeguimiento'});
        }
      }
    });

    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const notificacion = notificationAnalyzer(notification.android.clickAction, notification.data, this.props);
      if (notificacion.type != 'NUEVO_MENSAJE') {
        this.props.newNotification({...notificacion, id: notification.data.Id});
      }
        
    });
  }
  componentWillUnmount() {
    this.notificationListener();
    this.removeNotificationOpenedListener();
  }

  render(){
    return(
        <FlatList
          style={[{
            position: "absolute",
            width: '90%',
            left: '2.5%',
            margin:10,
            backgroundColor:'transparent'
          }]}
          data={this.props.notificationList}
          keyExtractor={(notificacion) => notificacion.id.toString()}
          renderItem={(notificacion) => 
            <Animacion  eliminarPop={ ()=>this.props.removeNotification(notificacion.item.id)}>
              <PopUp 
                onPress={async () => {
                  switch(notificacion.item.type){
                    case 'NUEVO_EVENTO':{
                      await this.props.updateEvent(notificacion.item.id);
                      this.props.selectEvent(notificacion.item.id);
                      this.props.removeNotification(notificacion.item.id);
                      this.props.onPress({routeName: 'DetalleAlerta'});
                      break;
                    }
                    case'FIN_EVENTO':{
                      this.props.removeNotification(notificacion.item.id);
                      break;
                    }
                    case 'NUEVO_SEGUIMIENTO': {
                      await this.props.fetch_seguimiento(notificacion.item.id);
                      this.props.seleccionar_seguimiento(notificacion.item.id);
                      this.props.removeNotification(notificacion.item.id);
                      this.props.onPress({routeName: 'DetalleSeguimiento'})
                      break;
                    }
                    case 'NUEVO_GRUPO': {
                      await this.props.updateGrupo(notificacion.item.id);
                      this.props.seleccionarGrupo(notificacion.item.id);
                      this.props.removeNotification(notificacion.item.id);
                      this.props.onPress({routeName: 'GrupoSeleccionado'});
                    }
                    case 'FIN_SEGUIMIENTO': {
                      this.props.removeNotification(notificacion.item.id);
                      break;
                    }

                  }
                }}
                notificacion={notificacion.item}
              />   
            </Animacion>
          }
        />
    );
  }
}

const mapStateToProps = state => {
  return { 
      notificationList: state.notificationList
   };
}
export default connect(mapStateToProps,
  {
    fetchEventos,
    updateEvent,
    selectEvent, 
    newNotification, 
    removeNotification,
    fetchEvento, 
    updateGrupo,
    getListaGrupos,
    seleccionarGrupo,
    getUserToken,
    fetch_seguimientos,
    seleccionar_seguimiento,
    fetch_seguimiento,
    nuevoMensaje,
    eliminarGrupo
  })(NotificacionPush);