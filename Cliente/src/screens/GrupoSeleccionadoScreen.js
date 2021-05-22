import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, AppState, Dimensions } from 'react-native';
import { Appbar, Card, Paragraph, Title } from 'react-native-paper';
import { Layout, Text, Input, Button, withStyles} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import * as signalR from '@microsoft/signalr';
import moment from 'moment-with-locales-es6';

import {gruposEndpoint} from '../api';
import { nuevoMensaje, setStateSpinner, deseleccionarGrupo } from '../redux/actions';
import GrupoHeader from '../components/header/GrupoHeader';

const {height} = Dimensions.get('window');
class GrupoSeleccionadoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            texto: ''        
        }
        this.id = jwtDecode(this.props.token).sub;

        moment.locale('es');
        this.sendMessage = this.props.navigation.getParam('sendMessage', null);
        
    }

    componentDidMount() {
        if (!this.sendMessage) {
            console.log("Entre al else");
            this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${gruposEndpoint}/gruposHub`, { accessTokenFactory: () => this.props.accessToken})
            .withAutomaticReconnect()
            .configureLogging(signalR.NullLogger)
            .build();
            
            this.connection.start().catch(() => {
                setTimeout(this.connection.start, 5000)
            });
            this.sendMessage = (grupoId, mensaje) => {
                this.connection.send("NewMessage", grupoId, mensaje)
            }
        }
    }
    

    

    newMensaje = async () => {
        if (!this.state.texto) return
        this.setState({texto: ''})
        console.log("ES NULLL? : " + this.sendMessage == null);
        console.log(this.sendMessage);
        if (this.sendMessage) this.sendMessage(this.props.grupo.grupoId, {integranteId: this.id, message: this.state.texto});
    }


    _goBack = () => { 
        if (this.connection) {console.log("STOPPING"); this.connection.stop();}
        this.props.navigation.pop();
        this.props.deseleccionarGrupo();
        
        
    }

    renderAppBar = () => {
        return (
            <GrupoHeader 
            nombreGrupo={this.props.grupo.grupoNombre}
            onBack={this._goBack}
            onMoreDetails={() => this.props.navigation.navigate('DetalleGrupoSeleccionado')}
            right={true}
            />
        )
    }

    renderTextInput = () => {
        const {theme} = this.props;
        return (
            <Layout style={{ flexDirection: 'row', height: height * 0.1, backgroundColor: theme['background-basic-color-1'],  alignItems: 'center', paddingHorizontal: '5%' }}>
                <Input
                    editable={this.props.grupo.eliminado ? false : true}
                    style={{ flex: 1 }}
                    placeholder='Mensaje...'
                    value={this.state.texto}
                    onChangeText={(texto) => this.setState({ texto })}
                />
                <TouchableOpacity
                    disabled={this.props.grupo.eliminado ? true : false}
                    style={{
                        width: '10%',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}
                    onPress={() => this.newMensaje()}
                >
                    <Icon size={24} color="#2f95dc" name="send" />
                </TouchableOpacity>
            </Layout>
        )
    }

    renderItem = ({item, index}) => {
        const {themedStyle, grupo} = this.props;
        const reply = item.integranteId != this.id;
        return (
            <Layout style={[reply ? themedStyle.containerIn  : themedStyle.containerOut, themedStyle.container]}>   
                <Layout style={[reply ? themedStyle.indicatorIn  : themedStyle.indicatorOut, themedStyle.indicator]} />                 
                <Layout style={[{
                    justifyContent: 'center',
                    overflow: 'hidden',
                    minHeight: 48,
                    minWidth: 48,
                    maxWidth: '70%',
                    borderRadius: 4,
                    padding: 8,
                }, reply ? themedStyle.contentIn : themedStyle.contentOut]}>
                    {reply && index < grupo.historialMensajes.length - 1 && grupo.historialMensajes[index + 1].integranteId != item.integranteId && <Text style={{marginHorizontal: 12, alignSelf: 'flex-start', fontWeight: 'bold'}} status={reply ? 'basic' : 'control'} category='s2'>{item.mensaje.nombreEmisor}</Text> }
                    {reply && index == grupo.historialMensajes.length - 1 && <Text style={{marginHorizontal: 12, alignSelf: 'flex-start', fontWeight: 'bold'}} status={reply ? 'basic' : 'control'} category='s2'>{item.mensaje.nombreEmisor}</Text> }
                    <Text style={{marginHorizontal: 12, marginVertical: 6}} status={reply ? 'basic' : 'control'}>{item.mensaje.contenido}</Text>
                </Layout>
                <Text
                    style={{marginHorizontal: 18}}
                    appearance='hint'
                    category='c2'>
                        {moment(item.fechaHoraMensaje).format('LT')}
                </Text>
            </Layout>
        )
    }

    renderMensajes = () => {
        const {theme, grupo} = this.props;
        return (
            <FlatList
                style={{ flex: 1, backgroundColor: theme['background-basic-color-4'], padding: 8}}
                data={this.props.grupo.historialMensajes}
                renderItem={this.renderItem}         
                inverted  
                keyExtractor={item => item.nroMensaje.toString()}
            />
        )
    }

    render() {
        const {theme} = this.props;
        if (!this.props.grupo) return null;
        return (
            <View style={{flex: 1, backgroundColor: theme['background-basic-color-4']}}>
                {this.renderAppBar()}
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {this.renderMensajes()}
                    </View>
                    <View style={{ }}>
                        {this.renderTextInput()}
                    </View>
                </View>
                {this.props.grupo.eliminado && 
                <View style={{position: 'absolute', backgroundColor: 'red', borderRadius: 5, top: 100, alignSelf: 'center'}}>
                    <Text style={{color: 'white'}}>Ha sido eliminado del grupo</Text>
                </View>}
            </View>
        )
    }
}

GrupoSeleccionadoScreen.navigationOptions = { header: null, tabBarVisible: false };

mapStateToProps = state => {
    return {
        grupo: state.grupoSeleccionado,
        token: state.accessToken.token.idToken,
        accessToken: state.accessToken.token.accessToken,
    }
}

const pantalla = connect(mapStateToProps, { nuevoMensaje, setStateSpinner, deseleccionarGrupo })(GrupoSeleccionadoScreen);

export default withStyles(pantalla, theme => ({
    container: {
        alignItems: 'center',
        flex: 1,
        marginVertical: 3,
        backgroundColor: 'transparent',
    },
    containerIn: {
        flexDirection: 'row',
    },
    containerOut: {
        flexDirection: 'row-reverse',
    },
    contentIn: {
        backgroundColor: 'white',
    },
    contentOut: {
        backgroundColor: theme['color-primary-default'],
    },
    date: {
        marginHorizontal: 18,
    },
    indicator: {
        width: 12,
        height: 12,
    },
    indicatorIn: {
        backgroundColor: 'white',
        transform: [
          { rotateZ: '-45deg' },
          {translateX: 4},
          {translateY: 4}
        ],
      },
    indicatorOut: {
        backgroundColor: theme['color-primary-default'],
        transform: [
          { rotateZ: '45deg' },
          {translateX: -4},
          {translateY: 4}
        ],
    },
}))