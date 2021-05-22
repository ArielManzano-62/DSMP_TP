import React, { Component } from 'react'
import { Dimensions, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import { crearGrupo } from '../redux/actions'
import { connect } from 'react-redux'
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import Textstyles from '../constants/TextStyles';

import { Layout, Button, Input, TopNavigation, TopNavigationAction, withStyles, Icon, List, ListItem, Avatar, Text } from '@ui-kitten/components'

import { gruposEndpoint } from '../api';
import ProfilePhoto from '../components/ProfilePhoto';

var { height, width } = Dimensions.get('window');

const ArrowBackFill = (style, color) => {
    return (
        <Icon name='arrow-ios-back' {...style} tintColor={color} />
    );
}

const searchFill = (style, color) => {
    return (
        <Icon name='search' {...style} tintColor={color} />
    );
}

const CameraIconFill = (style) => {
    return (
        <Icon name='camera' {...style}/>
    );
}

const imagePickerOptions = {
    title: 'Seleccione Foto',    
    cancelButtonTitle: 'Cancelar',
    takePhotoButtonTitle: "Sacar una Foto",
    chooseFromLibraryButtonTitle: "Desde la libreria",
    cameraType: 'front',
    mediaType: 'photo',
    quality: 1,
    storageOptions: {
        skipBackup: true,
    },
}


class CrearGrupoScreen extends Component {

    state = {
        nombreError : {
            hasError: false,
            caption: ''
        },
        emailError: {
            hasError: false,
            caption: ''
        },
        nombreGrupo: '',
        email: '',
        picture: null,
        loading: false,
        creando: false,
        invitaciones: []
    };

    elegirAvatar = () => {
        ImagePicker.showImagePicker(imagePickerOptions, async (response) => {
            if (!response.didCancel) {
                this.setState({picture: {
                    uri: response.uri,
                    type: response.type,
                    fileName: response.fileName
                }});
            }
            
        })
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
            return;
        }
        if (this.validarMailAgregado()){
            this.setState({emailError: {hasError:true, caption:'El mail ya esta agregado'}})
            this.setState({email:''})
            return;
        }

        if (this.validarMailEsCreador()) {
            this.setState({emailError: {hasError: true, caption: 'No puede agregarse a usted mismo'}})
            this.setState({email: ''})
            return;
        }
        const email = this.state.email
        axios.get(`${gruposEndpoint}/api/grupos/integrantes?email=${email}`)
            .then(res => {console.log(res.data); this.agregarInvitacion(res.data)})
            .catch(err => {
                this.setState({emailError: {hasError: true, caption: 'No existe usuario con dicho mail'}});
                this.setState({ email: '' })
            })
    }

    crearGrupo = async () => {
        if (this.validarNombreGrupo()) {
            this.setState({nombreError: {hasError: true, caption: 'Escriba un nombre para el grupo'}});
            
            return;
        }
        this.setState({creando: true});
        const grupo = {
            picture: this.state.picture,
            grupoNombre: this.state.nombreGrupo,
            usuariosId: this.state.invitaciones.map(i => i.id),
        };
        try {
            await this.props.crearGrupo(grupo);
            this.props.navigation.popToTop();
        } catch (error) {
            console.log(error);
        }
        


    }

    validarFormatoMail = () => {
        let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return (!this.state.email
            || !reg.test(this.state.email))
    }

    validarMailAgregado = () => {
        return (
            this.state.invitaciones.filter(invitacion => invitacion.email == this.state.email).length > 0             
        );
    }

    validarMailEsCreador = () => (this.props.profile.email === this.state.email)

    validarNombreGrupo = () => {
        return (!this.state.nombreGrupo)
    }

    eliminarInvitiacion = (email) => {
        const nl = this.state.invitaciones.filter(invitacion => invitacion.email != email)
        this.setState({ invitaciones: nl })
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


    renderHeader = (themedStyle) => {
        return (
            <TopNavigation
                style={themedStyle.container}
                title='Nuevo grupo'
                titleStyle={[Textstyles.headline, themedStyle.title]}
                alignment='center'
                leftControl={this.renderLeftControl(themedStyle.icon.color)}
                
            />
        );
    }

    renderSearch = () => {
        const {themedStyle, theme} = this.props;
        const {emailError} = this.state;
        return (
            <Input
                label='Agregar Integrante'
                labelStyle={{fontSize: 17, marginBottom: 8, marginTop: 4}}
                placeholder='Email'
                status={emailError.hasError ? 'danger' : ''}
                caption={emailError.hasError ? emailError.caption : ''}
                value={this.state.email}
                onChangeText={(email) => this.setState({ email, emailError: {hasError: false, caption: ''} })}
                onIconPress={() => this.verificarMail()}
                icon={(style) => {
                    const color = emailError.hasError ? theme['color-danger-default'] : theme['color-primary-default'];
                    return searchFill(style, color)
                }} />
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
                style={{ flex: 1, height: '100%', backgroundColor: 'white', marginHorizontal: 10, borderBottomColor: 'white' }}
                data={this.state.invitaciones}
                renderItem={this.renderItem}
            />
        );
    }

    renderTextInput = () => {
        const {themedStyle, theme} = this.props;
        const {nombreError} = this.state;

        return (
            <Input
                placeholder='Nombre del grupo'
                status={nombreError.hasError ? 'danger' : ''}
                caption={nombreError.hasError ? nombreError.caption : ''}
                style={{flex: 1, marginLeft: width * 0.05}}
                value={this.state.nombreGrupo}
                onChangeText={nombreGrupo => this.setState({ nombreGrupo: nombreGrupo, nombreError: {hasError: false, caption: ''} })}
                icon={() => <Icon name='edit-outline' tintColor={nombreError.hasError ? theme['color-danger-default'] : theme['color-primary-default']} style={{ height: 20, width: 20, marginLeft: 10 }} />} />
        );
    }

    renderPhotoButton = () => {
        const { themedStyle } = this.props;
    
        return (
          <Button
            style={themedStyle.photoButton}
            activeOpacity={0.95}
            icon={CameraIconFill}
            onPress={this.elegirAvatar}
          />
        );
    };

    render() {
        const { themedStyle } = this.props
        const { creando, picture } = this.state;
        return (
            <Layout style={{ flex: 1 }}>
                {this.renderHeader(themedStyle)}
                <KeyboardAvoidingView style={{ flex: 1 }}>
                    <Layout style={{flexDirection: 'row', paddingHorizontal: width * 0.05, paddingVertical: 10, alignItems: 'center'}}>
                        <ProfilePhoto 
                            style={themedStyle.photo}
                            source={picture ? {uri: picture.uri} : {uri: 'https://closely.s3.sa-east-1.amazonaws.com/groupavatar2.png'}}
                            button={this.renderPhotoButton}
                        />
                        {this.renderTextInput()}                        
                    </Layout>
                    <Layout style={{paddingHorizontal: width * 0.05, marginVertical: 12}}>
                        {this.renderSearch()}
                    </Layout>                    
                    {this.renderList()}
                </KeyboardAvoidingView>
                <Button 
                    style={{marginHorizontal: width * 0.05, marginBottom: height * 0.02}}
                    disabled={creando}
                    onPress={this.crearGrupo}>
                    Crear
                </Button>
            </Layout>
        );
    }

}

CrearGrupoScreen.navigationOptions = { header: null, };

const screen = withStyles(CrearGrupoScreen, (theme) => ({
    container: {
        backgroundColor: theme['background-primary-color-1'],
    },
    containerList: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
        overflow: 'hidden',
        elevation: 2
    },
    title: {
        color: theme['text-control-color'],
        fontWeight: 'bold'
    },
    subtitle: {
        color: theme['text-control-color'],
        
    },
    photoSection: {
        marginVertical: 40,
        backgroundColor: theme['background-basic-color-2'],
    },
    infoSection: {
        marginTop: 24,
        backgroundColor: theme['background-basic-color-1'],
    },
    actionsSection: {
        marginTop: 24,
        backgroundColor: theme['background-basic-color-1'],
    },
    profileSetting: {
        borderBottomWidth: 1,
        borderBottomColor: theme['border-basic-color-2'],
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    photo: {
        width: 76,
        height: 76,
    },
    abandonarGrupoLabel: {
        color: theme['color-danger-600'],
        alignSelf: 'flex-start'
    },
    modalAbandonar: {
        width: width - 30,
        height: height * 0.3,
        top: (height - height * 0.3) / 2,
        left: (width - (width - 30)) / 2,
    },
    photoButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        transform: [{ translateY: 50 }],
        borderColor: theme['border-basic-color-4'],
        backgroundColor: theme['background-basic-color-4'],
    },
    icon: {
        color: theme['text-control-color'],
        colorBase: theme['background-primary-color-1'],
    },
    listItemAvatar: {
        width: 52, 
        height: 52, 
        alignSelf: 'center'
    },
}));

const mapStatetoProps = state => {
    return {
        profile: state.profile,
    }
}
export default connect(mapStatetoProps, { crearGrupo })(screen)