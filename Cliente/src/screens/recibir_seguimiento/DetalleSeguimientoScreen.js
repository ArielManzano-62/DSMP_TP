import React, { Component } from 'react';
import { View, Dimensions, Platform, PixelRatio } from 'react-native';
import { connect } from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import { withStyles, Avatar, TopNavigation, TopNavigationAction, Layout, Text, Icon } from '@ui-kitten/components';
import * as signalR from '@microsoft/signalr';

import Textstyles from '../../constants/TextStyles';
import { actualizar_ubicacion_seguimiento_seleccionado } from '../../redux/actions'
import { eventosEndpoint } from '../../api';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE= -31.348891;
const LONGITUDE= -64.254058;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyBPkawtBCR4KdLBW-RRI492sRknc0KEt-g';

export class DetalleSeguimientoScreen extends Component {
    constructor(props) {
        super(props);
    
        this.mapView = null;
    }

    state = {
        direccion: {
            origin: '',
            destination: '',
            actual: '',
        },
        ruta: false,
    }
    
    componentDidMount = async () => {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${eventosEndpoint}/seguimientoHub`)
            .withAutomaticReconnect()
            .configureLogging(signalR.NullLogger)
            .build()
        this.connection.onreconnected(() => {
            this.connection.send("Subscribe", this.props.seguimiento.id);
        })
        this.connection.on('UpdateLocation', ubicacion => {
            this.props.actualizar_ubicacion_seguimiento_seleccionado(ubicacion);
        })
        this.connection.start().then(() => {
            this.connection.send("Subscribe", this.props.seguimiento.id);
        })
        .catch(() => {
            this.retryOnFirstConnection();
        });
        
    }

    retryOnFirstConnection = () => {
        this.connection.start()
        .then(() => this.connection.send("Subscribe", this.props.seguimiento.id))
        .catch(() => setTimeout(this.retryOnFirstConnection, 5000));
    }

    _onBack = () => { this.props.navigation.pop() }

    arrowBackFill = (style, color) => {
        return (
            <Icon name="arrow-ios-back" fill={color} style={style}/>
        );
    }
      
    renderLeftControl = (color) => {
        return (
            <TopNavigationAction
                icon={(style) => this.arrowBackFill(style, color)}
                onPress={this._onBack}
            />
        );
    };

    renderRightControl = (fotoUrl) => {
        return (
            <TopNavigationAction
                icon={(style) => {
                    delete style.tintColor
                    return <Avatar style={{...style, height: 35, width: 35}} source={{uri: fotoUrl}} />
                }}
            />
        );
    };

    renderHeader = () => {
        const {themedStyle} = this.props;
        const {nombre, apellido, fotoUrl} = this.props.seguimiento.usuario;
        
        return (
            <TopNavigation
              style={themedStyle.header}
              title={`${nombre} ${apellido}`}
              titleStyle={[Textstyles.headline, themedStyle.title]}
              alignment='center'
              leftControl={this.renderLeftControl(themedStyle.icon.color)}
              rightControls={this.renderRightControl(fotoUrl)}
            />
        );
      }

    renderCallout(title, text){
        return (
            <MapView.Callout tooltip>
                <Layout style={{justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10, opacity: 0.85}}>
                    <Text category='h6' status='primary'>
                        {title}
                    </Text>
                    <Text category='p1'>
                        {text}
                    </Text>
                </Layout>
            </MapView.Callout>
        );
    }

    renderMapDirections = () => {
        const {waypoints, destino, origen, modo} = this.props.seguimiento.ruta;
        return <MapViewDirections 
            region="AR"
            language="es"
            waypoints={ waypoints }
            origin={ origen }
            destination={ destino }
            apikey={ GOOGLE_MAPS_APIKEY }
            mode={ modo }
            strokeWidth={ 5 }
            strokeColor="blue"
            onReady={result => {
                this.setState({ruta: true});
                this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: (width / 20),
                      bottom: (height / 20),
                      left: (width / 20),
                      top: (height / 3),
                    }
                });
            }}
        />
    }    


    render() {
        const {origen, destino} = this.props.seguimiento.ruta;
        const {nombre, apellido} = this.props.seguimiento.usuario;
        const {ubicaciones, themedStyle} = this.props;
        const {estado} = this.props.seguimiento;

        if (!this.state.direccion.origin) getDirection(origen).then(v => this.setState({direccion: { ...this.state.direccion, origin: v }}))
        if (!this.state.direccion.destination) getDirection(destino).then(v => this.setState({direccion: { ...this.state.direccion, destination: v }}))
        if (!this.state.direccion.actual && ubicaciones.length > 0) getDirection(ubicaciones[ubicaciones.length - 1].posicion).then(v => this.setState({direccion: {...this.state.direccion, actual: v}}));
        return (
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>               
                
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={themedStyle.mapa}
                    ref={c => this.mapView = c}
                >
                    {origen && <MapView.Marker key={'origin'} coordinate={origen} pinColor={themedStyle.origenMarker.color}>
                        {this.renderCallout('Origen', this.state.direccion.origin)}  
                    </MapView.Marker>}
                    {destino && <MapView.Marker key={'destination'} coordinate={destino} pinColor={themedStyle.destinoMarker.color} >
                        {this.renderCallout('Destino', this.state.direccion.destination)}
                    </MapView.Marker>}
                    {ubicaciones.length > 0 && <MapView.Marker key={'actual'} coordinate={ubicaciones[ubicaciones.length-1].posicion} pinColor={themedStyle.positionMarker.color}>
                        {this.renderCallout(`${nombre} ${apellido}`, this.state.direccion.actual)}
                    </MapView.Marker>}
                    {this.props.seguimiento.ruta && this.renderMapDirections()}
                    {ubicaciones.length >= 2 && this.state.ruta && <MapView.Polyline 
                        coordinates={ubicaciones.map(u => u.posicion)}
                        strokeColor={estado === 'Desviado' ? themedStyle.ubicacionesPolyline.colorNotOnCourse : themedStyle.ubicacionesPolyline.colorOnCourse}
                        strokeWidth={5}/>}
                </MapView>
                {estado === 'Desviado' && 
                <Layout style={themedStyle.notOnCourseOverlay}>                    
                        <Text style={themedStyle.notOnCourseLabel}>Se ha desviado de la ruta original</Text>
                </Layout>}   
                {this.renderHeader()}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        seguimiento: state.seguimientoSeleccionado,
        ubicaciones: state.seguimientoSeleccionado.ubicaciones.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
    }
}

function getLatLng(latitude, longitude){
    return {latitude, longitude}
}

DetalleSeguimientoScreen.navigationOptions = { header: null, };

const scale = width / 320;

function normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

async function getDirection({latitude, longitude}){
    await Geocoder.init(GOOGLE_MAPS_APIKEY, {language : "es"});
    return await Geocoder.from(latitude, longitude)
        .then(json => {
            var addressComponent = json.results[0].address_components;
            var address = {}
            addressComponent.map( ac => {
                var type = ac.types.find(t => t === 'street_number' || t === 'route' || t === 'locality');
                if(type) address[type] = ac.short_name;
            })
            return `${address.route} ${address.street_number}, ${address.locality}`;
        })
        .catch(error => console.warn(error));       
}

const screen = withStyles(DetalleSeguimientoScreen, (theme) => ({
    mapa: {
        flex: 1,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: normalize(18)
    },
    header: {
        position: 'absolute',
        alignSelf: 'center',
        width: width ,
        backgroundColor: theme['background-primary-color-1'],
    },
    icon: {
        color: 'white',
    },
    avatar: {
        position: 'absolute',
        top: height * 0.06,
        left: width * 0.45
    },
    origenMarker: {
        color: theme['color-danger-300']
    },
    destinoMarker: {
        color: theme['color-success-300']
    },
    positionMarker : {
        color: theme['color-primary-300']
    },
    ubicacionesPolyline: {
        colorOnCourse: theme['color-success-500'],
        colorNotOnCourse: theme['color-danger-500']
    },
    notOnCourseOverlay: {
        position: 'absolute', 
        alignSelf: 'center', 
        top: height * 0.12, 
        paddingHorizontal: 10, 
        paddingVertical: 6, 
        borderRadius: 5,
        backgroundColor: theme['color-danger-500']
    },
    notOnCourseLabel: {        
        color: theme['text-control-color'],
        fontWeight: 'bold'

    },
})
)
export default connect(mapStateToProps, { actualizar_ubicacion_seguimiento_seleccionado })(screen)
