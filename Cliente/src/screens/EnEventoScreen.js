import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, PermissionsAndroid, Animated, Dimensions, Easing, KeyboardAvoidingView, DeviceEventEmitter, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { Button, Paragraph, Dialog, Portal, TextInput, Snackbar, Divider } from 'react-native-paper';
import TextStyles from '../constants/TextStyles';
import { withStyles , Text, Layout, Icon, } from '@ui-kitten/components';
import FIcon from 'react-native-vector-icons/Feather';
import * as signalR from '@microsoft/signalr';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { NavigationEvents } from 'react-navigation';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import Map from '../components/Map';
import { enviarFinalizacionEvento, enviarResolucionEvento, updateLocation, nuevoMensajeEvento, setStateSpinner } from '../redux/actions';
import { eventosEndpoint, videoEndpoint } from '../api';
import GetLocation from '../utils/GetLocation';
import Chat from '../components/Chat';

const {height, width} = Dimensions.get('window');

const UPDATE_LOCATION = "update_location";

class EnEventoScreen extends React.Component {
    constructor(props) {
        super(props);

        this.map;

        this.state = {
            descriptionDialogText: "",
            selected: null,
            descriptionDialogVisible: false,
            snackbarVisible: false,
            modalVisible: false,
            text: "",
            chatText: '',
            recording: false,
            messageCounter: 0,
            isChatHidden: true,
            location: false,
            modalInput: {
                text: "",
                error: false
            },
            locations: [],
            animatingMarker: false,
        };

        this.animatedValue = new Animated.Value(0);
        this.animatedChat = new Animated.Value(0);
        this.animatedMarkerValue = new Animated.Value(1);
    }

    connectionStart = () => {
        NativeModules.EventoModule.connectWithEvent(this.props.evento.eventoId);
    }

    componentDidMount = async () => {
        this.props.setStateSpinner(false)

        console.log(this.gps);
        const {evento} = this.props;
        console.log("a-a-a-a-a-a-a--a-a-a--a-a-a-a-a-a--a-a-a-a--a-a-a--a-a-a--a-a")
        console.log(evento)
        console.log(evento.eventoId)
        flagEvento = evento.ubicaciones != undefined
        flagmessage = evento.message != undefined

        if (flagEvento && evento.ubicaciones.length > 0) {
            evento.ubicaciones.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
            var ubicacionesMap = evento.ubicaciones.map(u => ({latitude: u.latitude, longitude: u.longitude}));
            console.log(ubicacionesMap);
            this.setState({locations: ubicacionesMap}, () => {
                this.map.animateCamera({
                    center: {
                        latitude: this.state.locations[this.state.locations.length-1].latitude,
                        longitude: this.state.locations[this.state.locations.length-1].longitude,
                    },
                    zoom: 16
                })
            });
            this.startMarkerAnimation();
            
        }

        if (this.props.evento.estado === 'Esperando Resolucion') {
            this.setState({ descriptionDialogVisible: true });
        } else {
            if(flagmessage) this.setState({messageCounter: this.props.evento.mensajes.length});
            DeviceEventEmitter.addListener(UPDATE_LOCATION, (location) => this.newLocation(location));
            console.log("el evento id es: " + this.props.evento.eventoId)
            NativeModules.EventoModule.connectWithEvent(this.props.evento.eventoId);
    

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`${eventosEndpoint}/eventoHub`)
                .withAutomaticReconnect()
                .configureLogging(signalR.NullLogger)
                .build();
            this.connection.onreconnected(() => {
                this.connection.send("Subscribe", this.props.evento.eventoId)
            });

            this.connection.onclose((error) => {
                console.log(error);
            })
            this.connection.on('NuevoMensaje', (mensaje) => {
                this.props.nuevoMensajeEvento(mensaje);
                if (this.state.isChatHidden) this.setState({messageCounter: this.state.messageCounter + 1})
            });
            this._startConnection();

            await this.requestLocationPermission();

                const cameraPermission = await this.requestCameraPermission();
                const audioRecordPermission = await this.requestAudioRecordPermission();

            if (cameraPermission && audioRecordPermission) {
                this.setState({ recording: true })                    
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(this.animatedValue, {
                            toValue: 150,
                            duration: 2000,        
                        }),
                        Animated.timing(this.animatedValue, {
                            toValue: 0,
                            duration: 2000,      
                        })
                    ])     
                ).start();
                this.vb.start();
            }
                        
        }
    }

    _startConnection = () => {
        this.connection.start()
        .then(() => {
            this.connection.send("Subscribe", this.props.evento.eventoId);
        })
        .catch((error) => {
            console.warn(error);
            this._startConnection();
        });
    }

    newLocation = (location) => {
        console.log("hooooooooooooooooooooooooola")
        if(location.latitude == undefined || location.longitude == undefined)return;
        var locations = {latitude:location.latitude, longitude:location.longitude}
        console.log(locations)
        this.updateLocation(locations)
    }

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Necesitamos acceder a tu ubicación",
                message: "Utilizamos tu ubicación para brindarte un mejor servicio",
                buttonPositive: "OK",
                buttonNegative: "Cancel"
              }
            );
            if (granted) {
                this.setState({location: true});
                NativeModules.EventoModule.connectWithEvent(this.props.evento.eventoId);
            };
          } catch (err) {
            Alert.alert(err)
          }
    }

    requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Permiso de uso de Cámara',
                message:
                  'Closely requiere hacer uso de su camara ' +
                  'para poder enviar video en tiempo real durante la emergencia.',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          console.warn(err);
        }
      }
    
      requestAudioRecordPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Permiso para grabar audio',
              message:
                'Closely requiere usar el micrófono ' +
                'para poder enviar audio en tiempo real durante la emergencia.',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          console.warn(err);
        }
      }

      animateChat = () => {
        var toValue;
        if (this.state.isChatHidden) {
            toValue = 0;
        } else {
            toValue =  this.animatedViewPositionY;            
        }                        
        Animated.timing(this.animatedChat, {
            toValue: toValue,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.exp
        }).start()
        this.setState( {isChatHidden: !this.state.isChatHidden, messageCounter: 0})
    }

    finalizarEvento = async () => {
        await this.props.enviarFinalizacionEvento(this.state.modalInput.text)
            .then(async () => {
                NativeModules.EventoModule.connectionStop();
                this.connection.stop();
                this.setState({ modalVisible: false, descriptionDialogVisible: true });
                if (this.vb) this.vb.stop();
                
            })
            .catch(err => this.setState(prevState => ({ snackbarVisible: true, modalInput: { ...prevState.modalInput, error: true } })));
    }

    resolverEvento = async () => {
        const estadoFinal = this.state.selected ? this.state.selected : 0;
        await this.props.enviarResolucionEvento(this.state.descriptionDialogText, estadoFinal)
            .then(() => this.props.navigation.navigate('Home'))
            .catch((err) => console.log(err.message));
    }

    _onModalInputChangeText = (text) => {
        var re = new RegExp("[0-9]{4}");
        if (re.test(text) && text.length == 4) {
            this.setState(prevState => ({
                modalInput: {
                    ...prevState.modalInput,
                    text,
                    error: false
                }
            }));
        } else {
            this.setState(prevState => ({
                modalInput: {
                    ...prevState.modalInput,
                    text,
                    error: true
                }
            }));
        }

    }

    _onFeelingPressed = (feeling) => {
        this.setState({ selected: feeling });
    }

    _onChangeText = (text) => {
        this.setState({ text })
    }

    _onPressEnter = () => {
        if (!this.state.text) return
        this.setState({ text: '' })
    }

    sendNewMessage = async (message) => {
        console.log("EL MENSAJE ESSSSSSSSSSSSSSS" + message)
        await this.connection.invoke('NuevoMensaje', {
            mensaje: message,
            userId: this.props.profile.sub,
            eventoId: this.props.evento.eventoId
        })
        .then((mensaje) => {
            this.props.nuevoMensajeEvento(mensaje);
        }).catch(err => console.log(err));
    }

    renderDescription = () => {
        if (this.state.selected !== null) {
            return (
                <View>
                    <TextInput
                        multiline
                        placeholder='Cuentanos más...'
                        theme={{ colors: { primary: '#2D6491' } }}
                        value={this.state.descriptionDialogText}
                        onChangeText={(t) => this.setState({ descriptionDialogText: t })} />
                </View>
            );
        }
    }

    startMarkerAnimation = () => {
        const {animatingMarker} = this.state;
        if (!animatingMarker) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(this.animatedMarkerValue, {
                        toValue: 1.222222,
                        duration: 2000,
                        useNativeDriver: true          
                    }),
                    Animated.timing(this.animatedMarkerValue, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true
                    })
                ])     
            ).start();
            this.setState({animatingMarker: true});
        }
    }

    updateLocation = (location) => {
        /*if (this.connection === undefined || this.connection.state !== signalR.HubConnectionState.Connected) {
            return;
        }
        this.connection.send("UpdateLocation", this.props.evento.eventoId, { latitude: location.latitude, longitude: location.longitude });
        */
       if (this.state.locations.length == 0) this.map.animateCamera({
            center: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            zoom: 16
        })
        this.setState({locations: [...this.state.locations, { latitude: location.latitude, longitude: location.longitude }]}, this.startMarkerAnimation);
    }

    renderButtonFinalizar = () => {
        if(this.state.modalVisible || this.state.descriptionDialogVisible) return;
        return (
            <View style={{ position: 'absolute', marginHorizontal: 15, bottom: '10%', width: '95%', alignSelf: 'center', zIndex: 1 }}>
                <View style={{ marginTop: 5, marginHorizontal: 3 }}>
                    <Button mode='contained' dark color="#de4043" onPress={() => this.setState({ modalVisible: true })} >Finalizar</Button>
                </View>
            </View>
        )
    }

    renderBroadcaster = () => {
        const { themedStyle } = this.props;

        const interpolateColor = this.animatedValue.interpolate({
            inputRange: [0, 150],
            outputRange: ['rgb(40, 149, 239)', 'rgb(12, 61, 138)']
          });
        const animatedSyle = {
            backgroundColor: interpolateColor
        }

        return (
            <>
              <NodeCameraView 
                style={{ height: '5%' }}
                ref={(vb) => { this.vb = vb }}
                outputUrl = {`rtmp://${videoEndpoint}/live/${this.props.evento.eventoId}`}
                camera={{ cameraId: 1, cameraFrontMirror: true }}
                audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
                autopreview={true}
                />
              <Animated.View style={[{position: 'absolute', top: 0, left: 0,  height: '5%', width: '100%', justifyContent: 'center', alignItems: 'center'}, animatedSyle]}>
                <Text category='s1' style={themedStyle.recordingText}>Transmitiendo audio y video</Text>
              </Animated.View>
            </>
        )
    }

    render() {
        const {themedStyle, theme} = this.props;
        const {locations} = this.state;

        const interpolateColor = this.animatedValue.interpolate({
            inputRange: [0, 150],
            outputRange: ['rgb(40, 149, 239)', 'rgb(12, 61, 138)']
          });

        const animatedStyle = this.animatedViewPositionY ? {
            transform: [{ translateY: this.animatedChat, }],
            bottom: 0,
        } : {}

        const markerAnimatedStyle = {
            transform: [
                {scaleX: this.animatedMarkerValue},
                {scaleY: this.animatedMarkerValue}
            ]
        }

        return (
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                <NavigationEvents onWillBlur={this._willBlur}/>
                {/*this.state.location && <GetLocation ref={r => this.gps = r} updateLocation={this.updateLocation} /> */}
                {this.state.recording ? this.renderBroadcaster() : null} 
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    ref={map => this.map = map}
                >     
                    {locations.length > 0 && 
                    <MapView.Marker coordinate={locations[locations.length-1]}>
                        <Layout style={{width: 28, height: 28, borderRadius: 14, backgroundColor: theme['text-control-color'], justifyContent: 'center', alignItems: 'center'}} elevation={10}>
                            <Animated.View style={[{width: 18, height: 18, borderRadius: 9, backgroundColor: theme['color-primary-default']}, markerAnimatedStyle]} />
                        </Layout>
                    </MapView.Marker>}
                    {locations.length > 0 && 
                    <MapView.Polyline 
                        coordinates={locations}
                        strokeColor={theme['color-primary-default']}
                        strokeWidth={5}/>
                    }
                </MapView>
                {this.state.isChatHidden && <TouchableWithoutFeedback 
                    disabled={locations.length == 0} 
                    onPress={() => {
                        this.map.fitToCoordinates(locations, { 
                            edgePadding: {
                                right: (width / 20),
                                bottom: (height/ 2),
                                left: (width / 20),
                                top: (height / 5),
                            }}
                        )
                    }}>
                    <Layout style={themedStyle.centerButtonContainer} >
                        <Icon name='pin' height={height * 0.05} width={height * 0.05} tintColor={theme['color-primary-default']}/>
                    </Layout>
                </TouchableWithoutFeedback>}
                {this.renderButtonFinalizar()}
                <Animated.View style={[themedStyle.chatView, animatedStyle, {zIndex: 2}]}
                onLayout={({nativeEvent}) => {
                    if (!this.animatedViewPositionY) {                        
                        this.animatedChat.setValue(nativeEvent.layout.y);
                        this.animatedViewPositionY = nativeEvent.layout.y;
                    }
                }}>
                    <TouchableWithoutFeedback onPressIn={this.animateChat}>
                        <Layout level='3' style={themedStyle.chatHeader} elevation={2}>
                            <Text category='h6'>Chat</Text>
                            <Icon name={this.state.isChatHidden ? 'arrowhead-up-outline' : 'arrowhead-down-outline'} width={24} height={24} tintColor={theme['color-info-active']}/>
                            <View>
                                <Icon name='message-square-outline' tintColor={theme['color-primary-default']} width={24} height={24} />
                                {this.state.messageCounter > 0 ? 
                                <View style={themedStyle.messageIconBadge}>
                                    <Text style={{color: 'white'}}>{this.state.messageCounter}</Text>
                                </View> : null}
                            </View>                                
                        </Layout>
                    </TouchableWithoutFeedback>                    
                    <Chat 
                        style={{flex: 1}}
                        mensajes={this.props.evento.mensajes}
                        sendMessage={this.sendNewMessage}
                    />
                </Animated.View>                                
                <Dialog
                    visible={this.state.modalVisible}
                    onDismiss={() => this.setState({ modalVisible: false })}
                >
                    <Dialog.Title>Finalizar Evento</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Ingrese su código de finalizacion</Paragraph>
                        <TextInput
                            label="Código"
                            selectionColor='rgb(0,0,0)'
                            error={this.state.modalInput.error}
                            value={this.state.modalInput.text}
                            onChangeText={(t) => this._onModalInputChangeText(t)}
                            theme={{ colors: { primary: '#2D6491' } }}
                        >
                        </TextInput>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => this.setState({ modalVisible: false })} theme={{ colors: { primary: '#2D6491' } }}>Cancel</Button>
                        <Button onPress={() => this.finalizarEvento()} disabled={this.state.modalInput.error} theme={{ colors: { primary: '#2D6491' } }}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog
                    visible={this.state.descriptionDialogVisible}
                    onDismiss={() => console.log("we")}
                >
                    <Dialog.Title>¿Cómo fue la ayuda que recibiste?</Dialog.Title>
                    <Divider />
                    <Dialog.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 15 }}>
                            <TouchableOpacity style={themedStyle.button} onPress={() => this._onFeelingPressed(1)}>
                                <FIcon
                                    name="frown"
                                    size={this.state.selected === 1 ? 60 : 50}
                                    color={this.state.selected === 1 ? '#FDAF92' : '#C8CED3'}>
                                </FIcon>
                            </TouchableOpacity>
                            <TouchableOpacity style={themedStyle.button} onPress={() => this._onFeelingPressed(3)}>
                                <FIcon
                                    name="meh"
                                    size={this.state.selected === 3 ? 60 : 50}
                                    color={this.state.selected === 3 ? '#FFDD8C' : '#C8CED3'} >
                                </FIcon>
                            </TouchableOpacity>
                            <TouchableOpacity style={themedStyle.button} onPress={() => this._onFeelingPressed(5)}>
                                <FIcon
                                    name="smile"
                                    size={this.state.selected === 5 ? 60 : 50}
                                    color={this.state.selected === 5 ? '#D8E361' : '#C8CED3'} >
                                </FIcon>
                            </TouchableOpacity>

                        </View>
                        {this.renderDescription()}
                    </Dialog.Content>
                    <Divider />
                    <Dialog.Actions>
                        <Button onPress={() => this.resolverEvento()} theme={{ colors: { primary: '#2D6491' } }}>Omitir</Button>
                        <Button onPress={() => this.resolverEvento()} theme={{ colors: { primary: '#2D6491' } }}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>

                

                <Snackbar
                    visible={this.state.snackbarVisible}
                    onDismiss={() => this.setState({ snackbarVisible: false })}
                    duration={3500}
                    style={{ backgroundColor: 'red', color: 'white' }}
                    action={{
                        label: 'OK',
                        onPress: () => {
                            this.setState({ snackbarVisible: false });
                        }
                    }}
                    theme={{ colors: { accent: 'white' } }}
                >
                    Código incorrecto
                        </Snackbar>

            </View>
        );
    }
}


const pantalla = withStyles(EnEventoScreen, (theme) => {
    return ({
        modalContainer: {
            backgroundColor: 'white',
            padding: 22,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        contentTitle: {
            fontSize: 20,
            marginBottom: 12,
        },
        button: {
            borderRadius: 25,
            borderWidth: 0,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
        },
        recordingText: {
            color: theme['text-control-color'],
          ...TextStyles.subtitle,
        },
        chatView: {
            position: 'absolute',
            right: 0, 
            bottom: '-92%',
            left: 0,  
            height: '100%', 
            width: '100%',
        },
        centerButtonContainer: {
            position: 'absolute', 
            top: height * 0.025, 
            right: width * 0.025, 
            elevation: 5, 
            borderRadius: height * 0.025, 
            padding: 5
        },
        chatHeader: { 
            height: '8%',
            paddingHorizontal: '5%', 
            alignItems: 'center', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            borderBottomWidth: 0.2,
            borderBottomColor: theme['color-control-focus-border']
        },
        messageIconBadge: {
            position: 'absolute', 
            alignSelf: 'flex-end', 
            height: 24, 
            transform: [{ translateX: 12}, {translateY: -12}], 
            width: 24, 
            borderRadius: 12, 
            padding: 4,
            borderColor: 'white', 
            backgroundColor: theme['color-danger-default'], 
            alignItems: 'center', 
            justifyContent: 'center',
        },
        chatViewContentContainer: {
            flex: 1, 
        }
    })
});

const mapStateToProps = state => {
    return { 
        evento: state.evento.evento,
        profile: state.profile,
     };
}

export default connect(
    mapStateToProps,
    { enviarFinalizacionEvento, enviarResolucionEvento, updateLocation, nuevoMensajeEvento, setStateSpinner }
)(pantalla);
