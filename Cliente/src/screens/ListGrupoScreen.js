import React, { Component } from 'react';
import { View, TouchableOpacity, Text, AppState, Dimensions } from 'react-native';
import { Avatar, TopNavigation, TopNavigationAction, Icon, Spinner, Layout, withStyles, List, ListItem} from '@ui-kitten/components';
import { connect } from 'react-redux';
import moment from 'moment-with-locales-es6';
import {NavigationEvents} from 'react-navigation';
import firebase from 'react-native-firebase';
import * as signalR from '@microsoft/signalr';
import calendarConfig from '../constants/calendarConfig';

import { gruposEndpoint } from '../api';
import { getListaGrupos, updateGrupo, nuevoMensaje, seleccionarGrupo, setStateSpinner } from '../redux/actions';
import TextStyles from '../constants/TextStyles';

const {height, width} = Dimensions.get('window');

const PlusOutline = (style, color) => {
    return (
        <Icon name='plus-outline' {...style} tintColor={color}/>
    );
}

const EyeOutline = (style, color) => {
    return (
        <Icon name='eye-outline' {...style} tintColor={color}/>
    );
}

const PeopleIcon = (style, color) => {
    return (
        <Icon name='people' {...style} tintColor={color} />
    );
}


class ListGrupoScreen extends Component {    
    constructor(props) {
        super(props);
        

    }
    

    async componentDidMount() {        
        this._fetchData();

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${gruposEndpoint}/gruposHub`, { accessTokenFactory: () => this.props.accessToken})
            .withAutomaticReconnect()
            .configureLogging(signalR.NullLogger)
            .build();
        this.connection.on('MensajeExitoso', (registroMensaje) => {
            this.props.nuevoMensaje(registroMensaje);
        });
        this.connection.on('NuevoMensaje', (registroMensaje) => {
            if (AppState.currentState === 'background') {
                this.crearNotificacionPushLocal(registroMensaje);                
            }
            this.props.nuevoMensaje(registroMensaje);
        });

        await this.connection.start().catch(() => {
            setTimeout(this.connection.start, 5000)
        });
    }

    async componentWillUnmount() {
        await this.connection.stop();
    }

    _fetchData = () => {
        try {
            this.props.getListaGrupos();
        } catch (error) {}
        
        
    }

    crearNotificacionPushLocal(registroMensaje) {
        try {
            firebase.notifications().android.createChannel(new firebase.notifications.Android.Channel('local-channel', 'Local-Channel', firebase.notifications.Android.Importance.Max));
        
            const notification = new firebase.notifications.Notification()
            .setNotificationId(`${registroMensaje.grupoId}${registroMensaje.nroMensaje}`)
            .setTitle(`${registroMensaje.mensaje.nombreEmisor} @ ${this.props.listaGrupos.filter(g => g.grupoId === registroMensaje.grupoId)[0].grupoNombre}`)
            .setBody(`${registroMensaje.mensaje.contenido}`)                
            .setData({
                Id: registroMensaje.grupoId,
                Mensaje: registroMensaje,
            }) 
            .android.setChannelId('local-channel')
            .android.setClickAction('NUEVO_MENSAJE')
            .android.setPriority(firebase.notifications.Android.Priority.Max);


            firebase.notifications().displayNotification(notification);
        } catch (error) {
            console.log(error);
        }
    }

    

    sendMessage = (grupoId, mensaje) => {
        this.connection.send("NewMessage", grupoId, mensaje)
    }

    crearGrupo = () => {
        this.props.navigation.navigate('CrearGrupo');
    }    

    renderIcon = () => {
        const {themedStyle} = this.props

        return PeopleIcon(themedStyle.iconAlert, themedStyle.iconColor.color);
    }

    renderRightControls = (color) => {
        return (    
            <View style={{justifyContent: "flex-end",flex:1, flexDirection: "row"}}>
                <TopNavigationAction
                    icon={(style) => PlusOutline(style, color)}
                    onPress={this.crearGrupo}                
                /> 
            </View> 
        );
    }

    renderHeader = () => {
        const { themedStyle } = this.props;
        return (
            <TopNavigation 
                style={themedStyle.headerContainer}
                title='Grupos'
                titleStyle={themedStyle.title}
                alignment='center'                             
                rightControls={this.renderRightControls(themedStyle.icon.color)}
            />
        );
    }

    renderAvatar = (style, src) => {
        delete style.tintColor;
        const {themedStyle} = this.props;
        return (                
            <Avatar shape='round' 
                source={{uri: src}} 
                style={[style, themedStyle.listItemAvatar]} />
        );    

    }

    renderItem =  ({item}) => { 
        const { themedStyle, theme, mensajesLeidos } = this.props;
        const {historialMensajes, grupoNombre, fotoUrl, fechaHoraCreacion, grupoId} = item;

        var description = historialMensajes.length > 0 ? `${historialMensajes[0].mensaje.nombreEmisor}: ${historialMensajes[0].mensaje.contenido}` : 'El grupo ha sido creado';    
        const fechaHora = historialMensajes.length > 0 ? historialMensajes[0].fechaHoraMensaje : fechaHoraCreacion;

        const mensajesNoLeidos = historialMensajes.length > 0 ? historialMensajes[0].nroMensaje - mensajesLeidos[grupoId] : 0;
        return (
            <ListItem 
                style={[themedStyle.listItem, {padding: 0, overflow: 'hidden'}]}
                title={`${grupoNombre}`}
                description={description}
                titleStyle={[themedStyle.listItemTitle, {flex: 1, top: '10%'}]}
                descriptionStyle={[themedStyle.listItemDescription, {flex: 1,}]}
                icon={(style) => this.renderAvatar(style, fotoUrl)}
                accessory={() => (
                    <Layout style={{alignSelf: 'stretch', backgroundColor: 'transparent'}}>                    
                        <Text category='s2'>{moment(fechaHora).calendar(null, calendarConfig)}</Text>
                        {mensajesNoLeidos > 0 && 
                        <Layout style={{
                            width: 16,
                            height: 16,
                            alignSelf: 'flex-end',
                            marginTop: 6,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 4,
                            backgroundColor: theme['color-danger-500'],
                            borderRadius: 8,
                        }}>
                            <Text style={{color: theme['color-control-default']}}>{mensajesNoLeidos}</Text>
                        </Layout>} 
                    </Layout>
                    
                )}
                onPress={() => {
                    this.props.seleccionarGrupo(grupoId);
                    this.props.navigation.navigate('GrupoSeleccionado', {
                        sendMessage: this.sendMessage
                    });
                    this.props.updateGrupo(grupoId);
                    
                }}
            />
        );
    }

    renderEmptyList = () => {
        return (
            <Layout level='2' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {this.renderIcon()}
                <Text category='s1' appearence='hint' style={{textAlign: 'center'}}>
                    No integra Grupos
                </Text>
            </Layout>
        )
        
    }

    render() {
        const {theme} = this.props;
        return (
            <Layout style={{flex:1}}>
                {this.renderHeader()}
                <NavigationEvents onDidFocus={() => this._fetchData()} />                   
                <List
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: theme['background-basic-color-2'] }}
                    data={this.props.listaGrupos}
                    renderItem={this.renderItem}                    
                    keyExtractor={item => item.grupoId}
                    ListEmptyComponent={this.renderEmptyList}
                />
            </Layout>
        )
    }
}

ListGrupoScreen.navigationOptions = { header: null,};

mapStateToProps = state => {
    return {
        listaGrupos: Object.values(state.listaGrupos).sort((a, b) => {
            const lastMessageA = a.historialMensajes.length > 0 ? a.historialMensajes[0].fechaHoraMensaje : a.fechaHoraCreacion;
            const lastMessageB = b.historialMensajes.length > 0 ? b.historialMensajes[0].fechaHoraMensaje : b.fechaHoraCreacion;

            return (new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime());
        }),
        spinner: state.spinner.loading,
        accessToken: state.accessToken.token.accessToken,
        mensajesLeidos: state.mensajesLeidos,
    }
}

const Screen = withStyles(ListGrupoScreen, (theme) => {
    return ({
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
        iconAlert : {
            width: 100,
            height: 100
        },
        iconColor: {
            color: theme['color-primary-500']
        },
        listItem: {
            height: 75, 
            backgroundColor: 'transparent', 
            borderBottomWidth: 0.2, 
            borderBottomColor: theme['color-control-focus-border']
        },
        listItemTitle: {            
            fontSize: 16,
        },
        listItemDescription: {
            ...TextStyles.headline,
            fontSize: 14,
        },
        listItemAvatar: {
            width: 52, 
            height: 52, 
            alignSelf: 'center'
        },
    });
})

export default connect(mapStateToProps, { getListaGrupos, updateGrupo, seleccionarGrupo, setStateSpinner, nuevoMensaje })(Screen)