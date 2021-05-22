import React, {Component} from 'react';
import { View, Dimensions } from 'react-native';
import { withStyles, TopNavigation, TopNavigationAction, Layout, Text, Avatar, Icon, Modal, Button, List, ListItem } from '@ui-kitten/components';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import moment from 'moment-with-locales-es6';
import Polyline from '@mapbox/polyline'

import TextStyles from '../constants/TextStyles';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE= -31.348891;
const LONGITUDE= -64.254058;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class DetalleHistorialSeguimientoScreen extends Component {

    constructor(props) {
        super(props);
        moment.locale('es');
    
        this.mapView = null;
    }

    state = {
        modal: false
    }

    _onBack = () => {
        this.props.navigation.pop();
    }

    renderLeftControl = (color) => {
        return (
          <TopNavigationAction
                icon={(style) => ArrowBackFill(style, color)}
                onPress={this._onBack}            
          />
        );
    };
    
    renderHeader = () => {
        const { themedStyle, theme } = this.props;
        return (
            <TopNavigation 
                style={{backgroundColor: theme['background-primary-color-1']}}
                title='Historial de Seguimientos'
                titleStyle={themedStyle.title}
                alignment='center'
                leftControl={this.renderLeftControl(themedStyle.icon.color)}               

            />
        );
    }

    renderAvatar = (style, src) => {
        delete style.tintColor;

        return (                
            <Avatar shape='round' 
                source={{uri: src}} 
                style={[style]} />
        );    

    }
    renderItem =  ({item}) => { 

        return (
            <ListItem 
                style={{padding: 0}}
                title={`${item.nombre}`}
                icon={(style) => this.renderAvatar(style, item.fotoUrl)}                
            />
        );
    }

    renderModalElement = (grupos) => {
        const { theme } = this.props;
        return (
            <Layout
            style={{
                width: width * 0.7,
            }}>
                <List
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: theme['background-basic-color-2'] }}
                    data={grupos}
                    renderItem={this.renderItem}                    
                    keyExtractor={item => item.id}
                />
            </Layout>
        );
    }

     toggleModal = () => {
        this.setState({modal: !this.state.modal});
      };

    renderModal = (grupos) => (
        <Modal
            backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.3)',}}
            onBackdropPress={this.toggleModal}
            visible={this.state.modal}>
            {this.renderModalElement(grupos)}
        </Modal>
    );

    renderBody = (seguimiento) => {
        const {fechaHoraInicio, fechaHoraFin, usuario} = seguimiento;
        
        var dateInicio = new Date(fechaHoraInicio); 
        var dateFin = new Date(fechaHoraFin); 
        
        var diff = dateFin.getTime() - dateInicio.getTime(); 
        
        const secDiff = diff / 1000;
        const minDiff = secDiff/ 60;
        const hourDiff = Math.floor(minDiff / 3600000);

        const seconds = padNumber(Math.floor(secDiff - 60 * Math.floor(minDiff)), 2)
        const minutes = padNumber(Math.floor(minDiff - 60 * hourDiff), 2)
        const hours = padNumber(hourDiff, 2)

        const { themedStyle } = this.props;
        return <Layout style={themedStyle.body}>
            <Layout style={{ flex: 2, alignItems: 'center', padding: 10}}>
                <Avatar source={{uri: usuario.fotoUrl}} size='giant'  />
                <Text category='h5' style={{padding: 10, fontWeight: 'bold'}}>{`${usuario.nombre} ${usuario.apellido}`}</Text>
                <Text category='s1'> {moment(fechaHoraInicio).format('LTS')} </Text>
            </Layout>
            <Layout style={{ flex: 1, width: width, flexDirection: 'row'}}>
                <Layout style={themedStyle.footer}>
                    <Button 
                        status='primary'
                        appearance='ghost'
                        size='giant'
                        onPress={this.toggleModal} 
                        style={[themedStyle.footer, {borderColor: 'transparent'}]} 
                        icon={ (style)=> <Icon name='people-outline' {...style}/>}
                    >
                        Grupos
                    </Button>
                </Layout>
                
                <Layout style={[themedStyle.footer, {flexDirection: 'column', justifyContent: 'center'}]}>
                    <Text category='h5' style={{fontWeight: 'bold'}}> Duración </Text>
                    <Text category='h6' style={{textAlign: 'center'}}> {hours}h {minutes}m {seconds}s </Text>
                </Layout>
            </Layout>
        </Layout>
    }

    renderCallout(title, fechaHora){
        return(
            <MapView.Callout tooltip>
                <Layout style={{justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', alignItems: 'center', padding: 10, borderRadius: 10, opacity: 0.85}}>
                    <Text category='h6' status='primary'>
                        {title}
                    </Text>
                    <Text category='p1'>
                        {moment(fechaHora).format('LTS')}
                    </Text>
                </Layout>
            </MapView.Callout>
        )
    }

    renderPolyline(ubicaciones, color){
        return(
            <MapView.Polyline 
                coordinates={ubicaciones} 
                strokeWidth={5}
                strokeColor={color}
            />
        )
    }

    renderMap = (ruta, ubicaciones) => {
        const {themedStyle, theme} = this.props;
        const ubicacionesLatLng = ubicaciones.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()).map(u => ({latitude: u.posicion.latitude, longitude: u.posicion.longitude}))
        return (
            <View style={{ flex: 0.6, backgroundColor: 'transparent' }}>
                <MapView
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    provider={PROVIDER_GOOGLE}
                    style={themedStyle.mapa}
                    ref={c => this.mapView = c}
                    onMapReady={ () => {
                        if( ubicaciones && ubicaciones.length > 0){
                            this.mapView.fitToCoordinates([
                                ...ubicacionesLatLng,
                                ...ruta
                            ], {
                                edgePadding: {
                                  right: (width / 20),
                                  bottom: (height/20),
                                  left: (width / 20),
                                  top: (height / 5),
                                }
                            });
                        }
                    }}
                >
                    {ruta && ruta.length > 0 && 
                        <MapView.Marker 
                            key={'origin'} 
                            coordinate={{latitude: ruta[0].latitude, longitude: ruta[0].longitude}} >
                                {this.renderCallout('Origen', ruta[0].fechaHora )}
                        </MapView.Marker>
                    }
                    {ruta && ruta.length > 1 && this.renderPolyline(ruta, theme['color-primary-default'])}
                    {ubicacionesLatLng && ubicacionesLatLng.length > 1 && this.renderPolyline(ubicacionesLatLng, theme['color-success-default'])}
                    {ruta && ruta.length > 1 &&
                        <MapView.Marker 
                        key={'destination'} 
                        coordinate={{latitude: ruta[ruta.length - 1].latitude, longitude: ruta[ruta.length - 1].longitude}} 
                        pinColor='green'>
                            {this.renderCallout('Destino', ruta[ruta.length - 1].fechaHora )}
                        </MapView.Marker>
                    }
                </MapView>
                {(!ruta || ruta.length === 0) && <View style={[{position: 'absolute', top: 0, width: width, height: height *0.6}, themedStyle.alert]}>
                    <Text category='h6'>No hay ubicaciones disponibles</Text>
                </View>}
            </View>
            
        );
    }

    renderContent = (e) => {
        const ruta = Polyline.decode(e.ruta.encodedPolyline).map(u => ({latitude: u[0], longitude: u[1]}));
        return(
            <Layout style={{ flex: 1, backgroundColor: 'transparent' }}>
                {this.renderMap(ruta, e.ubicaciones)}
                {this.renderBody(e)}
            </Layout>
        );
    }

    render(){
        var seguimiento = this.props.navigation.getParam('seguimiento', null);
        return(
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                {this.renderHeader()}
                {this.renderContent(seguimiento)}
                {this.renderModal(seguimiento.grupos)}
            </View>
        );
    }
}

const ArrowBackFill = (style, color) => {
    return (
        <Icon name='arrow-ios-back' {...style} tintColor={color}/>
    );
}

DetalleHistorialSeguimientoScreen.navigationOptions = {
    header: null
}

export default withStyles( DetalleHistorialSeguimientoScreen, theme => ({
    mapa: {
        flex: 1
     },
     alert: {
         justifyContent: 'center', 
         alignItems: 'center', 
         backgroundColor: 'rgba(200, 200, 200, 0.5)'
     },
     body: {
         flex: 0.4,
         alignItems: 'center',
         borderTopWidth: 1,
         borderColor: '#E0E0E0',
     },
     footer: {
         width: width/2, 
         justifyContent: 'center', 
         flexDirection: 'row', 
         alignItems: 'center', 
         padding: 10,
         borderWidth: 1,
         borderColor: '#E0E0E0'
     },
    headerContainer: {
        backgroundColor: theme['background-primary-color-1'],
    },
    icon: {
        color: theme['text-control-color'],
    },
    title: {
        color: theme['text-control-color'],
        ...TextStyles.headline,
        fontWeight: 'bold'
    },
}));
/*
const ArrowBackFill = (style, color) => {
    delete style.tintColor
    return (
        <Icon name='chevron-left' size={style.height} color={color}/>
    );
}*/

function padNumber(number, width = 2, padWith = '0') {
    const strNum = number.toString();
    return strNum.length >= width ? strNum : new Array(width - strNum.length + 1).join(padWith) + strNum;
}