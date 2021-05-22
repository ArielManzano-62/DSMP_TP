import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { Portal, Appbar } from 'react-native-paper';
import { NavigationEvents} from 'react-navigation';
import TextStyles from '../constants/TextStyles';
import axios from 'axios';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { connect } from 'react-redux';
import * as signalR from '@microsoft/signalr';
import { NodePlayerView } from 'react-native-nodemediaclient';

import { nuevoMensajeEvento} from '../redux/actions';
import { videoEndpoint, eventosEndpoint } from '../api';
import { withStyles, Layout, Text, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import Chat from '../components/Chat';

const { height, width} = Dimensions.get('window'); 
const window = Dimensions.get("window");
const screen = Dimensions.get('screen');


class DetalleEventoEnCursoScreen extends Component {
    constructor(props) {
        super(props);        
        
        this.chat;

        this.state = {
            timer: false,
            reconectar: true,
            messageCounter: 0,
            text: "",
            isStreaming: false,
            isVideoPlaying: false,
            isChatHidden: true,
            locations: [],
            animatingMarker: false,          
        }

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', payload => {
            if (this.vp) this.vp.stop();
            
            this.willBlurSubscription.remove();
        });

        this.animatedValue = new Animated.Value(0);
        this.animatedHeader = new Animated.Value(0);
        this.animatedVideoButton = new Animated.Value(0);
        this.animatedMarkerValue = new Animated.Value(1);
    } 

    componentDidMount() {
        const {eventoSeleccionado} = this.props;
        if (eventoSeleccionado.ubicaciones.length > 0) {
            eventoSeleccionado.ubicaciones.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
            var ubicacionesMap = eventoSeleccionado.ubicaciones.map(u => ({latitude: u.latitude, longitude: u.longitude}));
            this.setState({locations: ubicacionesMap}, () => {
                this.mapView.animateCamera({
                    center: {
                        latitude: this.state.locations[this.state.locations.length-1].latitude,
                        longitude: this.state.locations[this.state.locations.length-1].longitude,
                    },
                    zoom: 16
                })
            });
            this.startMarkerAnimation();
            
        }
        this.getStream();
        this.setState({messageCounter: this.props.eventoSeleccionado.mensajes.length})
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${eventosEndpoint}/eventoHub`)
            .withAutomaticReconnect()
            .configureLogging(signalR.NullLogger)
            .build();

        this.connection.on("UpdateLocation", ({latitude, longitude}) => {
            if (this.state.locations.length == 0) this.mapView.animateCamera({
                camera: {
                    latitude,
                    longitude
                },
                zoom: 16
            })
            this.setState({locations: [...this.state.locations, {latitude, longitude}]});
        })
        this.connection.onreconnected(() => {
            this.connection.send("Subscribe", this.props.eventoSeleccionado.id);
        })

        this.connection.on('NuevoMensaje', (mensaje) => {
            this.props.nuevoMensajeEvento(mensaje);
            if (this.state.isChatHidden) this.setState({messageCounter: this.state.messageCounter + 1})
        });

        this.connection.start().then(() => {
            this.connection.send("Subscribe", this.props.eventoSeleccionado.id);
        })
        .catch(() => {
            this.retryOnFirstConnection();
        });
    }

    retryOnFirstConnection = () => {
        this.connection.start()
        .then(() => this.connection.send("Subscribe", this.props.eventoSeleccionado.id))
        .catch(() => setTimeout(this.retryOnFirstConnection, 5000));
    }

    getStream = async () => {
        try {
            const response = await axios.get("http://www.4closely.com:8000/api/streams");
            if (response.data.live.hasOwnProperty(this.props.eventoSeleccionado.id)) {
                this.setState({isStreaming: true});
                this.startAnimation();
            }
                
        } catch (error) {}
        
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

    startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.animatedHeader, {
                    toValue: 150,
                    duration: 2000,   
                    useNativeDriver: false
                }),
                Animated.timing(this.animatedHeader, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false
                })
            ])     
        ).start();
    }

    _willBlur = async () => {
        await this.connection.send("Unsubscribe", this.props.eventoSeleccionado.id);
        await this.connection.stop();
    }

    _goBack = () => {
        this.props.navigation.pop();
    }

    sendNewMessage = async (message) => {
        try {
            const mensaje = await this.connection.invoke('NuevoMensaje', {
                mensaje: message,
                userId: this.props.profile.sub,
                eventoId: this.props.eventoSeleccionado.id
            });
            this.props.nuevoMensajeEvento(mensaje);
        } catch (error) {
            console.log(error);
        }            
    }

    _startStream = () => {
        if (!this.state.isVideoPlaying) {
            this.setState({ isVideoPlaying: true });
            Animated.timing(this.animatedVideoButton, {
                toValue: 100,
                duration: 350,
                useNativeDriver: true,
            }).start(() => this.vp.start());
        } else {
            this.setState({ isVideoPlaying: false });
            this.vp.stop();
            this.animatedVideoButton.setValue(0);
        }
        
    }

    animateChat = () => {
        if (this.state.isChatHidden) {
            var toValue = 0
        } else {
            var toValue = this.animatedViewPositionY;
        }                        
        Animated.timing(this.animatedValue, {
            toValue: toValue,
            duration: 350,
            easing: Easing.exp,
            useNativeDriver: true

            }).start()
        this.setState( {isChatHidden: !this.state.isChatHidden, messageCounter: 0})
    }


    //CAMBIAR
    /*renderHeader = () => {
        const { eventoSeleccionado } = this.props;
        return (
            <Appbar.Header style={{ elevation: 15 }}>
                <Appbar.BackAction onPress={this._goBack} />
                <Appbar.Content title={eventoSeleccionado.afectado.nombre} subtitle={eventoSeleccionado.tipoEvento}/>
            </Appbar.Header>
        );
    }*/

    renderLeftControl = () => {
        const {theme} = this.props;
        return (
            <TopNavigationAction
                icon={(style) => (<Icon name='arrow-ios-back' {...style}  tintColor={theme['text-control-color']}/>)}
                onPress={this._goBack}
            />
        );
    };

    renderHeader = () => {
        const {eventoSeleccionado, themedStyle} = this.props;
        return (
            <TopNavigation
                style={themedStyle.header}
                title={eventoSeleccionado.afectado.nombre}
                titleStyle={[themedStyle.title]}
                subtitle={eventoSeleccionado.tipoEvento}
                subtitleStyle={themedStyle.subtitle}
                alignment='center'
                leftControl={this.renderLeftControl()}
                
            />
        );
    }

    renderBroadcastHeader = () => {
        const {themedStyle} = this.props

        
        const interpolatedColor = this.animatedHeader.interpolate({
            inputRange: [0, 150],
            outputRange: ['rgb(40, 149, 239)', 'rgb(12, 61, 138)']
        })

        const animatedColor = {
            backgroundColor: interpolatedColor
        }

        return (
            <Animated.View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}, animatedColor]}>
                <Text category='c1' style={themedStyle.recordingText}>Transmitiendo Audio y Video</Text>
            </Animated.View>
        )
        
    }

    renderPlayer = () => {
        const { themedStyle } = this.props;
        
        return (
            <TouchableWithoutFeedback onPressIn={this._startStream}>
                <View style={{flex: 1, justifyContent: 'center'}}>                            
                    <NodePlayerView
                        style={{ flex: 1 }}
                        ref={(vp) => { this.vp = vp }}
                        inputUrl={`rtmp://${videoEndpoint}/live/${this.props.eventoSeleccionado.id}`}
                        scaleMode={"ScaleAspectFit"}
                        bufferTime={150}
                        maxBufferTime={300}
                        autoplay={false}                                
                    />
                    <Animated.View style={
                        {
                            position: 'absolute', 
                            alignSelf: 'center', 
                            alignItems: 'center', 
                            justifyContent: 'center' ,
                            height: 76, 
                            width: 76, 
                            borderRadius: 38, 
                            backgroundColor: 'grey',
                            opacity: this.animatedVideoButton.interpolate({
                                inputRange: [0, 100],
                                outputRange: [1, 0]
                            })
                        }}>
                        <Icon name="play-circle-outline" fill={themedStyle.recordingText.color} height={50} width={50} />
                    </Animated.View>                            
                </View>
            </TouchableWithoutFeedback>
        )
        
        
        
    }

    render() {
        const {themedStyle, theme} = this.props;     
        const {locations, isStreaming} = this.state;   

        const animatedStyle = this.animatedViewPositionY ? {
            transform: [{ translateY: this.animatedValue}],
            bottom: 0,
        } : {}

        const markerAnimatedStyle = {
            transform: [
                {scaleX: this.animatedMarkerValue},
                {scaleY: this.animatedMarkerValue}
            ]
        }

        return (
            <View style={[themedStyle.container, { backgroundColor: 'transparent' }]}>
                
                <MapView
                provider={PROVIDER_GOOGLE}            
                ref={map => this.mapView = map}
                style={themedStyle.mapView}                    
                >
                    {locations.length > 0 && 
                    <MapView.Marker coordinate={locations[locations.length-1]}>
                        <Layout style={{width: 28, height: 28, borderRadius: 14, backgroundColor: theme['text-control-color'], justifyContent: 'center', alignItems: 'center'}} elevation={2}>
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
                        this.mapView.fitToCoordinates(locations, { 
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
                <Animated.View style={[themedStyle.chatView, animatedStyle]}
                    onLayout={({nativeEvent}) => {
                        if (!this.animatedViewPositionY) {
                            this.animatedValue.setValue(nativeEvent.layout.y);
                            this.animatedViewPositionY = nativeEvent.layout.y
                        }
                    }}
                >
                    <TouchableWithoutFeedback onPressIn={this.animateChat}>
                        <Layout level='3' style={{height: '8%'}}>
                            {isStreaming && this.renderBroadcastHeader()}
                            <Layout level='3' style={themedStyle.chatHeader} elevation={2}>
                                <Text category='h6'>Chat</Text>
                                <Icon name={this.state.isChatHidden ? 'arrowhead-up-outline' : 'arrowhead-down-outline'} width={24} height={24} fill={themedStyle.arrowIcon.color}/>
                                <View>
                                    <Icon name='message-square-outline' fill={themedStyle.messageIcon.color} width={24} height={24} />
                                    {this.state.messageCounter > 0 ? 
                                    <View style={themedStyle.messageIconBadge}>
                                        <Text style={{color: 'white'}}>{this.state.messageCounter}</Text>
                                    </View> : null}
                                </View>                                
                            </Layout>
                        </Layout>
                    </TouchableWithoutFeedback>                    
                    <Layout level='4' style={themedStyle.chatViewContentContainer}>
                        {isStreaming && this.renderPlayer()}                        
                        <Chat 
                            style={{flex: 2}}
                            mensajes={this.props.eventoSeleccionado.mensajes}
                            sendMessage={this.sendNewMessage}
                        />
                        
                    </Layout>
                </Animated.View>
                {this.state.isChatHidden && this.renderHeader()}
                <NavigationEvents onWillBlur={this._willBlur}/>
            </View>
        );
    }    
}

DetalleEventoEnCursoScreen.navigationOptions = { header: null,};

const mapStateToProps = (state) => {
    return {
        eventoSeleccionado: state.eventoSeleccionado,
        profile: state.profile,
    };
}

const pantalla = withStyles(DetalleEventoEnCursoScreen, (theme) => {
    return ({
        container: {
            flex: 1,            
        },
        scrollView: {
            position: "absolute",  
        },
        mapView: { 
            flex: 1, 
        },
        header: {
            position: 'absolute',
            alignSelf: 'center',
            width: width ,
            backgroundColor: theme['background-primary-color-1'],
        },
        chatView: {
            position: 'absolute', 
            bottom: '-92%', 
            right: 0, 
            left: 0,  
            height: '100%', 
            width: '100%',
        },
        chatHeader: {
            flex: 3,
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
        },
        title: {
            color: theme['text-control-color'],
            fontWeight: 'bold'
        },
        subtitle: {
            color: theme['text-control-color'],
        },
        recordingText: {            
            color: theme['text-control-color'],
            ...TextStyles.subtitle,
        },
        arrowIcon: {
            color: theme['color-info-active']
        },
        messageIcon: {
            color: theme['color-primary-default']
        },
        centerButtonContainer: {
            position: 'absolute', 
            top: '10%', 
            right: '10%', 
            elevation: 5, 
            borderRadius: height * 0.025, 
            padding: 5
        },
    });
})


export default connect(mapStateToProps, {
    nuevoMensajeEvento
})(pantalla)
