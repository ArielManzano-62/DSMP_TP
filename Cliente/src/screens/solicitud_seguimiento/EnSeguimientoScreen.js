import React from 'react';
import {Dimensions, TouchableWithoutFeedback, Animated} from 'react-native';
import _ from 'lodash';
import { 
    Layout,
    Text,
    Icon,
    Button,
    Modal,
    Card,
    CardHeader,
    Input,
    withStyles,
    Spinner,
} from '@ui-kitten/components';
import { 
    connect 
} from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as signalR from '@microsoft/signalr';
import Geocoder from 'react-native-geocoding';

import GetLocation from '../../utils/GetLocation';
import { eventosEndpoint } from '../../api';
import { actualizar_ubicacion, finalizar_seguimiento, finalizar_automaticamente, getUserState, desviar, encursar } from '../../redux/actions';
import ScrollableAvoidKeyboard from '../../components/common/ScrollableAvoidKeyboard';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyBPkawtBCR4KdLBW-RRI492sRknc0KEt-g';

class EnSeguimientoScreen extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            route: false,
            coordinates: null,
            addresses: {
                origen: null,
                destino: null,                
            },
            visible: false,
            dialogPage: 1,
            codigo: '',
            valido: true,
            caption: '',
            finalizando: false,
            reconectar: true,
            animar: false,
        }
        this.animatedValue = new Animated.Value(0);
        
    }

    
    componentDidMount = () => {
        const { ruta, estado } = this.props.seguimiento;

        this.getDirection(ruta.origen).then(address => this.setState({addresses: {...this.state.addresses, origen: address}}));
        this.getDirection(ruta.destino).then(address => this.setState({addresses: {...this.state.addresses, destino: address}}));

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${eventosEndpoint}/seguimientoHub`)
            .withAutomaticReconnect()
            .configureLogging(signalR.NullLogger)
            .build()
        this.connection.start()
        .then(() => {
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

    updateLocation = async location => {
        if (this.connection === null || this.connection.state !== signalR.HubConnectionState.Connected) return;

        const {latitude, longitude} = location;
        try {
            
            var output = await this.connection.invoke('UpdateLocation', this.props.seguimiento.id, {latitude, longitude}); 
            this.props.actualizar_ubicacion(output.ubicacion);
            if (output.evento === "FINALIZAR") {
                this.props.finalizar_automaticamente();
                this.setState({dialogPage: 3, visible: true, reconectar: false});
                this.connection.stop();                
                setTimeout(() => this.props.navigation.navigate('Home'), 2500);
            }
            if (output.evento === "DESVIAR" || output.evento === "ENCURSAR") {
                this.setState({animar: true});
                if (output.evento === "DESVIAR") {   
                    this.props.desviar();                
                    Animated.timing(this.animatedValue, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,          
                    }).start();
                } else {
                    this.props.encursar();
                    Animated.timing(this.animatedValue, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                }
                   
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    getDirection = async ({latitude, longitude}) => {
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

    _resetModal = () => {
        if (this.state.dialogPage > 2) return;
        this.setState({dialogPage: 1, codigo: '', valido: true, caption: '', visible: false});
    }

    _setCodigo = (value) => {
        var re = new RegExp("^[0-9]{4}$");
        if (re.test(value))
            this.setState({codigo: value, valido: true, caption: ''});
        else 
            this.setState({codigo: value, valido: false, caption: 'Ingrese 4 dígitos'});
    }

    _finalizarSeguimiento = async () => {
        const {codigo} = this.state;

        var re = new RegExp("^[0-9]{4}$");
        const valido = re.test(codigo);  

        if (valido) {
            try {
                this.setState({finalizando: true});
                await this.props.finalizar_seguimiento(codigo, this.props.seguimiento.id);
                this.setState({dialogPage: 3, reconectar: false});
                setTimeout(() => this.props.navigation.navigate('Home'), 2500);
            } catch (error) {
                this.setState({finalizando: false, valido: false, caption: error.response.data.error_message});
            }
        }
        else this.setState({valido: false, caption: 'Ingrese 4 dígitos'});
    }

    renderMapViewDirections = ({origen, destino, waypoints, modo}) => {
        return (
            <MapViewDirections 
                region="AR"
                language="es"
                waypoints={ waypoints }
                origin={origen}
                destination={ destino }
                apikey={GOOGLE_MAPS_APIKEY}
                mode={modo}
                strokeWidth={5}
                strokeColor="blue"
                onReady={result => {
                    this.setState({route : true, coordinates: result.coordinates})
                    this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                        right: (width / 20),
                        bottom: (height / 5),
                        left: (width / 20),
                        top: (height / 5),
                    }
                    });
                }}
            />
        );
    }

    renderCallout(title, text) {
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


    renderModalElement = () => {        
        const {dialogPage, codigo, valido, caption, finalizando} = this.state;

        const Header = () => (
            <CardHeader
                title='Finalizar'
            />
        )
    
        const Footer = () => {  
            return (
                <Layout style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    }}>
                    <Button
                        style={{marginHorizontal: 4}}
                        size='small'
                        status='basic'
                        onPress={this._resetModal}>
                        CANCELAR
                    </Button>
                    <Button
                        style={{marginHorizontal: 4}}
                        size='small'
                        onPress={(dialogPage === 1) ? () => this.setState({dialogPage: dialogPage + 1}) : this._finalizarSeguimiento}>
                        ACEPTAR
                    </Button>
                </Layout>
            )}

        if (dialogPage === 1) return (
            <Card header={Header} footer={Footer} style={{marginHorizontal: width * 0.05}}>
                <Text>{"¿Está seguro que desea finalizar el seguimiento?\nAún no ha llegado a su destino."}</Text>
            </Card>)
        else if (dialogPage === 2) return (
            <ScrollableAvoidKeyboard>                    
                <Card header={Header} footer={Footer} style={{marginHorizontal: width * 0.05, width: width * 0.9, height: height * 0.34}}>
                    <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Input 
                            style={{flex: 3}}
                            label="Código de Seguridad"
                            placeholder="1234" 
                            value={codigo} 
                            onChangeText={v => this._setCodigo(v)} 
                            status={valido ? 'primary' : 'danger'}
                            caption={caption}
                            />
                        {finalizando && <Layout style={{justifyContent: 'center', alignItems: 'center', marginLeft: 8, marginTop: 12}} ><Spinner status='primary'/></Layout>}
                    </Layout>
                    
                </Card>
            </ScrollableAvoidKeyboard> 
        )
        else if (dialogPage === 3) return (
            <Card header={() => (<CardHeader title='Exito'/>)} status='success'>
                <Text>Seguimiento finalizado con éxito</Text>
            </Card>
        )
    }

    render() {
        const { ruta, estado } = this.props.seguimiento;
        const { ubicaciones } = this.props;
        const { themedStyle } = this.props;       

        return(
            <Layout style={{flex: 1}}>
                <GetLocation updateLocation={this.updateLocation}/>
                <MapView 
                    style={{flex: 2}}
                    ref={m => this.mapView = m}>
                    {ruta && ubicaciones &&
                        <>
                            <MapView.Marker coordinate={ruta.origen} pinColor={themedStyle.origenMarker.color}>
                            {this.renderCallout('Origen', this.state.addresses.origen)}
                            </MapView.Marker>
                            <MapView.Marker coordinate={ruta.destino} pinColor={themedStyle.destinoMarker.color}>
                                {this.renderCallout('Origen', this.state.addresses.destino)}
                            </MapView.Marker>                    
                            <MapView.Marker coordinate={ubicaciones.length == 0 ? ruta.origen : ubicaciones[ubicaciones.length - 1].posicion} pinColor={themedStyle.positionMarker.color}/>
                            {this.renderMapViewDirections(ruta)}
                            {ubicaciones.length >= 2 && this.state.route && <MapView.Polyline 
                                coordinates={ubicaciones.map(u => u.posicion)}
                                strokeColor={estado === 'Desviado' ? themedStyle.ubicacionesPolyline.colorNotOnCourse : themedStyle.ubicacionesPolyline.colorOnCourse }
                                strokeWidth={5}/>}
                        </>
                    }
                    
                </MapView>
                {estado === 'Desviado' && 
                <Animated.View style={[this.state.animar ? {opacity: this.animatedValue} : {opacity: 1}, themedStyle.notOnCourseOverlay]}>                    
                        <Text style={themedStyle.notOnCourseLabel}>Se ha desviado de la ruta original</Text>
                </Animated.View>}                
                <TouchableWithoutFeedback onPress={() => {
                    this.mapView.fitToCoordinates([...this.state.coordinates, ...ubicaciones.map(e => e.posicion)], { 
                        edgePadding: {
                            right: (width / 20),
                            bottom: (height/ 2),
                            left: (width / 20),
                            top: (height / 5),
                        }}
                    )
                    }}>
                    <Layout style={themedStyle.centerButtonContainer} >
                        <Icon name='pin' height={height * 0.05} width={height * 0.05} fill={themedStyle.centerButton.color}/>
                    </Layout>
                </TouchableWithoutFeedback> 
                <Button style={themedStyle.finalizarButton} status='danger' size='large' onPress={() => this.setState({visible: true})}>
                    FINALIZAR
                </Button>
                <Modal
                backdropStyle={themedStyle.backdrop}
                onBackdropPress={this._resetModal}
                visible={this.state.visible}>
                    {this.renderModalElement()}
                </Modal>          
            </Layout>
        );
    }
}

EnSeguimientoScreen.navigationOptions = {
    header: null
}

const pantalla = withStyles(EnSeguimientoScreen, theme => {
    return ({
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
        centerButtonContainer: {
            position: 'absolute', 
            top: height * 0.025, 
            right: width * 0.025, 
            elevation: 5, 
            borderRadius: height * 0.025, 
            padding: 5
        },
        centerButton: {
            color: theme['color-primary-default']
        },
        finalizarButton: {
            position: 'absolute', 
            alignSelf: 'center', 
            margin: width * 0.05, 
            bottom: height * 0.025, 
            width: width * 0.9
        },
        backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        notOnCourseOverlay: {
            position: 'absolute', 
            alignSelf: 'center', 
            top: height * 0.08, 
            paddingHorizontal: 10, 
            paddingVertical: 6, 
            borderRadius: 5,
            backgroundColor: theme['color-danger-500']
        },
        notOnCourseLabel: {        
            color: theme['text-control-color'],
            fontWeight: 'bold'
    
        },
    });
})

const mapStateToProps = state => {
    return {
        seguimiento: state.ruta.seguimiento,
        ubicaciones: !_.isEmpty(state.ruta.seguimiento) ? state.ruta.seguimiento.ubicaciones.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()) : undefined
    }
}

export default connect(mapStateToProps, {
    actualizar_ubicacion,
    finalizar_seguimiento,
    finalizar_automaticamente,
    getUserState,
    desviar,
    encursar
})(pantalla);