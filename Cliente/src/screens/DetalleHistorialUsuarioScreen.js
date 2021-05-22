import React from 'react';
import { View, Dimensions } from 'react-native';
import { withStyles, TopNavigation, TopNavigationAction, Layout, Text, Avatar } from '@ui-kitten/components';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment-with-locales-es6'

import TextStyles from '../constants/TextStyles';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE= -31.348891;
const LONGITUDE= -64.254058;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ArrowBackFill = (style, color) => {
    delete style.tintColor
    return (
        <Icon name='chevron-left' size={style.height} color={color}/>
    );
}

class DetalleHistorialUsuario extends React.Component {

    constructor(props) {
        super(props);
        moment.locale('es');
    
        this.mapView = null;
    }

    renderLeftControl = (color) => {
        return (
          <TopNavigationAction
                icon={(style) => ArrowBackFill(style, color)}
                onPress={() => this.props.navigation.pop()}            
          />
        );
    };

    renderHeader = () => {
        const { themedStyle } = this.props;
        return (
            <TopNavigation 
                style={themedStyle.headerContainer}
                title='Alerta'
                titleStyle={themedStyle.title}
                alignment='center'
                leftControl={this.renderLeftControl(themedStyle.icon.color)}
            />
        );
    }
    renderBody = (evento) => {
        const {fechaHoraInicio, fechaHoraFin, tipoEventoImagen, tipoEvento, usuario} = evento;
        
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
                <Avatar source={{uri: usuario.foto}} size='giant'  />
                <Text category='h5' style={{padding: 10, fontWeight: 'bold'}}>{`${usuario.nombre} ${usuario.apellido}`}</Text>
                <Text category='h6'> {moment(fechaHoraInicio).format('LTS')} </Text>
            </Layout>
            <Layout style={{ flex: 1, width: width, flexDirection: 'row'}}>
                <Layout style={themedStyle.footer}>
                    <Text category='h6'> {tipoEvento} </Text>
                    <Icon name={tipoEventoImagen} size={30} color='red'/>
                </Layout>
                <Layout style={[themedStyle.footer, {flexDirection: 'column', justifyContent: 'center'}]}>
                    <Text category='h5' style={{fontWeight: 'bold'}}> Duración </Text>
                    <Text category='h6' style={{textAlign: 'center'}}> {hours}h {minutes}m {seconds}s </Text>
                </Layout>
            </Layout>
        </Layout>
    }

    renderCallout(title, fechaHora){
        const fecha = moment(fechaHora).format('LTS');
        return(
            <MapView.Callout tooltip>
                <Layout style={{justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', alignItems: 'center', padding: 10, borderRadius: 10, opacity: 0.85}}>
                    <Text category='h6' status='primary'>
                        {title}
                    </Text>
                    <Text category='p1'>
                        {fecha}
                    </Text>
                </Layout>
            </MapView.Callout>
        )
    }

    renderPolyline(ubicaciones){
        let coordinates = ubicaciones.map(u => ({latitude: u.latitude, longitude: u.longitude}));
        
        return(
            <MapView.Polyline 
                coordinates={coordinates} 
                strokeWidth={5}
                strokeColor="blue"
            />
        )
    }

    renderMap = (ubicaciones) => {
        const {themedStyle} = this.props;
        if (ubicaciones && ubicaciones.length > 1) 
            ubicaciones.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

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
                        if(ubicaciones && ubicaciones.length > 0){
                            this.mapView.fitToCoordinates(
                                ubicaciones.map(u => ({latitude: u.latitude, longitude: u.longitude})), {
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
                    {ubicaciones && ubicaciones.length > 0 && 
                        <MapView.Marker 
                            key={'origin'} 
                            coordinate={{latitude: ubicaciones[0].latitude, longitude: ubicaciones[0].longitude}} >
                                {this.renderCallout('Inicio', ubicaciones[0].fechaHora )}
                        </MapView.Marker>
                    }
                    {ubicaciones && ubicaciones.length > 1 && this.renderPolyline(ubicaciones)}
                    {ubicaciones && ubicaciones.length > 1 &&
                        <MapView.Marker 
                        key={'destination'} 
                        coordinate={{latitude: ubicaciones[ubicaciones.length - 1].latitude, longitude: ubicaciones[ubicaciones.length - 1].longitude}} 
                        pinColor='green'>
                            {this.renderCallout('Fin', ubicaciones[ubicaciones.length - 1].fechaHora )}
                        </MapView.Marker>
                    }
                </MapView>
                {(!ubicaciones || ubicaciones.length === 0) && <View style={[{position: 'absolute', top: 0, width: width, height: height *0.6}, themedStyle.alert]}>
                    <Text category='h6'>No hay ubicaciones disponibles</Text>
                </View>}
            </View>
            
        );
    }

    renderContent = (e) => {
        return(
            <Layout style={{ flex: 1, backgroundColor: 'transparent' }}>
                {this.renderMap(e.ubicaciones)}
                {this.renderBody(e)}
            </Layout>
        );
    }

    render(){
        const evento = this.props.navigation.getParam('evento', null);
        console.log(evento);
        return(
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                {this.renderHeader()}
                {this.renderContent(evento)}
            </View>
        );
    }
}

function padNumber(number, width = 2, padWith = '0') {
    const strNum = number.toString();
    return strNum.length >= width ? strNum : new Array(width - strNum.length + 1).join(padWith) + strNum;
}

DetalleHistorialUsuario.navigationOptions = {
    header: null,
};

export default withStyles(DetalleHistorialUsuario, (theme) => ({
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
    }
}));