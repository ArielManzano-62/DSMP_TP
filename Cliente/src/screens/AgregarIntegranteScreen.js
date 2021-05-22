import React from 'react';
import {Dimensions, TouchableWithoutFeedback} from 'react-native';
import {Layout, Input, Button, Icon, Avatar, List, ListItem, TopNavigation, TopNavigationAction, withStyles} from '@ui-kitten/components';
import { connect } from 'react-redux';
import axios from 'axios';

import Textstyles from '../constants/TextStyles';
import {gruposEndpoint} from '../api';
import {agregar_integrantes} from '../redux/actions';

const searchFill = (style, color) => {
    return (
        <Icon name='search' {...style} tintColor={color} />
    );
}

const ArrowBackFill = (style, color) => {
    return (
        <Icon name='arrow-ios-back' {...style} tintColor={color} />
    );
}

const { width, height} = Dimensions.get('window');

class AgregarIntegranteScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            invitaciones: [],
            email: '',
            emailError: {
                hasError: false,
                caption: '',
            }
        }
    }

    agregarInvitacion = (integrante) => {
        const nuevaInvitacion = [...this.state.invitaciones, integrante]
        this.setState({ invitaciones: nuevaInvitacion, email: '' })
    }
    eliminarInvitiacion = (email) => {
        const nl = this.state.invitaciones.filter(invitacion => invitacion.email != email)
        this.setState({ invitaciones: nl })
    }

    verificarMail = () => {
        if (this.validarFormatoMail()) {
            this.setState({emailError: {hasError:true, caption:'Formato de mail no valido'}})
            this.setState({email:''})
            return
        }
        if(this.validarMailAgregado()){
            this.setState({emailError: {hasError:true, caption:'El mail ya esta agregado'}})
            this.setState({email:''})
            return
        }
        if (this.validarIntegrantePerteneceAGrupo()) {
            this.setState({emailError: {hasError: true, caption: 'El usuario ya pertenece al grupo'}})
            this.setState({email: ''});
            return;
        }
        const email = this.state.email
        axios.get(`${gruposEndpoint}/api/grupos/integrantes?email=${email}`)
            .then(res => {console.log(res.data); this.agregarInvitacion(res.data)})
            .catch(err => {
                this.setState({emailError: {hasError: true, caption: 'No existe usuario con dicho mail'}});
                this.setState({ email: '' })
            });
    }

    validarFormatoMail = () => {
        let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return (!this.state.email
            || !reg.test(this.state.email))
    }

    validarMailAgregado = () => {
        return this.state.invitaciones.filter(invitacion => invitacion.email == this.state.email).length > 0
    }

    validarIntegrantePerteneceAGrupo = () => {
        return this.props.grupo.integrantes.filter(integrante => integrante.email === this.state.email).length > 0;
    }

    agregarIntegrantes = async () => {
        const {grupo} = this.props;
        const {invitaciones} = this.state;

        try {
            await this.props.agregar_integrantes(grupo.grupoId, invitaciones.map(i => i.id))
            this.props.navigation.pop();
        } catch (error) { 
            console.log(error);
        }
    }

    _onBack = () => { this.props.navigation.pop() }

    renderLeftControl = (color) => {
        return (
            <TopNavigationAction
                icon={(style) => ArrowBackFill(style, color)}
                onPress={this._onBack}
            />
        );
    };


    renderHeader = () => {
        const {themedStyle, theme} = this.props;
        return (
            <TopNavigation
                style={themedStyle.headerContainer}
                title='Agregar Integrantes'
                titleStyle={[Textstyles.headline, themedStyle.headerTitle]}
                alignment='center'
                leftControl={this.renderLeftControl(theme['text-control-color'])}
                
            />
        );
    }

    renderAvatar = (style, fotoUrl) => {
        delete style.tintColor;
        const {themedStyle} = this.props;

        return (                
            <Avatar shape='round' 
                source={{uri: fotoUrl}} 
                style={[style, themedStyle.listItemAvatar]} />
        );        
    
    }

    renderItem = ({item}) => {
        const {themedStyle, theme} = this.props;
        return (
            <ListItem
                style={[themedStyle.containerList, { marginHorizontal: 1, paddingHorizontal: 0, elevation: 0 }]}
                title={`${item.nombre} ${item.apellido}`}
                description={item.email}
                icon={(style) => this.renderAvatar(style, item.fotoUrl)}
                accessory={(style) => (
                    <TouchableWithoutFeedback style={style} onPress={() => this.eliminarInvitiacion(item.email)}>
                        <Icon name='trash-2-outline' width={26} height={26} style={style} tintColor={theme['color-danger-600']} />
                    </TouchableWithoutFeedback>
                )} />
        );
    }

    renderList = () => {
        return (
            <List
                style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 10, borderBottomColor: 'white' }}
                data={this.state.invitaciones}
                renderItem={this.renderItem}
            />
        );
    }

    render() {
        const {themedStyle, theme} = this.props;
        const {emailError} = this.state;

        return (
            <Layout style={{flex: 1}}>
                {this.renderHeader()}
                <Layout style={themedStyle.container}>                
                <Input
                    style={{marginHorizontal: width * 0.05}}
                    placeholder='Email'
                    status={emailError.hasError ? 'danger' : ''}
                    caption={emailError.hasError ? emailError.caption : ''}
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email, emailError: {hasError: false, caption: ''} })}
                    onIconPress={() => this.verificarMail()}
                    icon={(style) => {
                        const color = emailError.hasError ? theme['color-danger-default'] : theme['color-primary-default'];
                        return searchFill(style, color)
                    }}/>
                {this.renderList()}
                <Button 
                    style={{marginHorizontal: width * 0.05}}
                    onPress={this.agregarIntegrantes}
                    disabled={this.state.invitaciones.length === 0}>
                    Agregar Integrantes
                </Button>
            </Layout>
            </Layout>
            
        );
    }
}

AgregarIntegranteScreen.navigationOptions = { header: null, tabBarVisible: false };

const pantalla = withStyles(AgregarIntegranteScreen, theme => ({
    container:  {
        flex: 1, 
        marginVertical: '3%'
    }, 
    inputLabelStyle: {
        fontSize: 17, 
        marginBottom: 8, 
        marginTop: 4
    },
    headerContainer: {
        backgroundColor: theme['background-primary-color-1'],
    },
    headerTitle: {
        color: theme['text-control-color'],
        fontWeight: 'bold'
    },
    listItemAvatar: {
        width: 52, 
        height: 52, 
        alignSelf: 'center'
    },
    containerList: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
        overflow: 'hidden',
        elevation: 2
    },
}));

const mapStateToProps = state => {
    return {
        grupo: state.grupoSeleccionado,
    }
}

export default connect(mapStateToProps, {agregar_integrantes})(pantalla);