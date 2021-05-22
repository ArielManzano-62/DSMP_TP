import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import { Appbar, HelperText, Portal } from 'react-native-paper';
import { withStyles, Layout, Icon, Button, Modal, Card, Spinner, CardHeader } from '@ui-kitten/components';
import { Dialog, TextInput, Button as PaperButton, Paragraph, ActivityIndicator, Caption } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

import { gruposEndpoint } from '../api';
import { connect } from 'react-redux';

import ProfileSetting from '../components/ProfileSetting';
import ProfilePhoto from '../components/ProfilePhoto';
import ProfileHeader from '../components/header/ProfileHeader';
import { logOut, modificarDatosPerfil, cambiarFotoPerfil } from '../redux/actions';
import Textstyles from '../constants/TextStyles';

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

const { height, width} = Dimensions.get('window');

class PerfilUsuarioScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalCancelarSuscripcion: false,
            motivoCancelacion: null,
            motivoModificado: false,
            modalPage: 1,
            visible: false,
            changePasswordSuccess: null,
        }
    }

    cerrarSesion = async () => {
        await this.props.logOut()
        .then(() => this.props.navigation.navigate('SignedOut'))
        .catch((err) => console.log(err));
    }

    elegirAvatar = () => {
        ImagePicker.showImagePicker(imagePickerOptions, async (response) => {
            await this.props.cambiarFotoPerfil(response.uri, response.type, response.fileName)
            .then((resp) => console.log(resp))
            .catch((err) => console.log(err));
        })
    }

    modificarNombre = () => {
        this.props.navigation.navigate('ModificarDato', {
            title: 'Modificar Nombre',
            guardar: (nombre) => this.props.modificarDatosPerfil({
                given_name: nombre,
            }),
            value: (this.props.profile['http://closely.com/user_metadata'].given_name) ? this.props.profile['http://closely.com/user_metadata'].given_name : this.props.profile.given_name,
        });
    }

    modificarApellido = () => {
        this.props.navigation.navigate('ModificarDato', {
            title: 'Modificar Apellido',
            guardar: (apellido) => this.props.modificarDatosPerfil({
                family_name: apellido,
            }),
            value: (this.props.profile['http://closely.com/user_metadata'].family_name) ? this.props.profile['http://closely.com/user_metadata'].family_name : this.props.profile.family_name,
        });
    }

    showCancelarSuscriptionDialog = () => {
        this.setState({ modalCancelarSuscripcion: true });
    }

    cancelarSuscripcion = async () => {
        this.setState({ modalPage: 3})
        try {
            await axios.post(`${gruposEndpoint}/api/suscripciones/cancelar`, { motivo: this.state.motivoCancelacion });
            this.setState({ modalPage: 4});
        } catch (error) {
            this.setState({ modalPage: 5 });
        }
        

    }

    _onMotivoCancelacionChanged = (text) => {
        this.setState({ motivoCancelacion: text, motivoModificado: true });
    }

    consultarHistorialAlertas = () => {
        this.props.navigation.navigate('HistorialAlertas');
    }

    consultarHistorialSeguimientos = () => {
        this.props.navigation.navigate('HistorialSeguimientos');
    }

    _cambiarContrasena = async () => {
        this.setState({visible: true});
        try {
            const response = await axios.post('https://closely.auth0.com/dbconnections/change_password', {
                client_id: 'zw4LQeIIAgz7MaYDzOPtWSa0ETniNZiy',
                email: this.props.profile.email,
                connection: "Username-Password-Authentication",
            });
            if (response.status === 200)
            this.setState({changePasswordSuccess: true});
        }
        catch (error) {
            this.setState({changePasswordSuccess: false})
        }
        
    }

    renderModalContent = () => {
        if (this.state.modalPage === 1)
            return (
                <>
                    <Dialog.Title>Cancelar Suscripción</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Indique el motivo de la cancelación</Paragraph>
                        <TextInput
                            label="Motivo"
                            selectionColor='rgb(0,0,0)'
                            error={(this.state.motivoCancelacion === "" || !this.state.motivoCancelacion) && this.state.motivoModificado}
                            value={this.state.motivoCancelación}
                            onChangeText={(t) => this._onMotivoCancelacionChanged(t)}
                            theme={{ colors: { primary: '#2D6491' } }}
                        />
                        <HelperText
                            visible={(this.state.motivoCancelacion === "" || !this.state.motivoCancelacion) && this.state.motivoModificado}
                            type="error"
                        >
                            El motivo no puede estar en blanco
                        </HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={() => this.setState({ modalCancelarSuscripcion: false, motivoModificado: false, motivoCancelacion: null})} theme={{ colors: { primary: '#2D6491' } }}>Atras</PaperButton>
                        <PaperButton onPress={() => {
                            const { motivoCancelacion } = this.state;
                            if (motivoCancelacion !== '' && motivoCancelacion !== null) {
                                this.setState({modalPage: 2})
                            } else {
                                this.setState({ motivoModificado: true})
                            }
                        }} theme={{ colors: { primary: '#2D6491' } }}>Continuar</PaperButton>
                    </Dialog.Actions>
                </>
            );
        else if (this.state.modalPage === 2)
            return(
                <>
                    <Dialog.Title>Atención</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>¿Está seguro que desea cancelar su suscripción?</Paragraph>
                        <Paragraph>Si desea volver a utilizar Closely, deberá realizar otra suscripción.</Paragraph>                        
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={() => this.setState({ modalCancelarSuscripcion: false, motivoModificado: false, motivoCancelacion: null, modalPage: 1})} theme={{ colors: { primary: '#2D6491' } }}>Atras</PaperButton>
                        <PaperButton onPress={this.cancelarSuscripcion} theme={{ colors: { primary: '#2D6491' } }}>Continuar</PaperButton>
                    </Dialog.Actions>
                </>
            );
        else if (this.state.modalPage === 3)
            return (
                <>
                    <Dialog.Title style={{alignSelf: 'center'}}>Suscripción</Dialog.Title>
                    <Dialog.Content>                        
                        <ActivityIndicator theme={{ colors: { primary: '#2D6491' } }}/>
                        <Caption style={{alignSelf: 'center'}}>Cancelando suscripción...</Caption>
                    </Dialog.Content>
                </>
            );
        else if (this.state.modalPage === 4)
            return(
                <>
                    <Dialog.Title style={{alignSelf: 'center'}}>Éxito</Dialog.Title>
                    <Dialog.Content>                        
                        <Paragraph>Su suscripción ha sido cancelada exitosamente.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={this.cerrarSesion}>Ok</PaperButton>
                    </Dialog.Actions>
                </>
            );
        else 
            return(
                <>
                    <Dialog.Title style={{alignSelf: 'center'}}>Atención</Dialog.Title>
                    <Dialog.Content>                        
                        <Paragraph>No se ha podido cancelar la suscripción. Intente nuevamente mas tarde.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={() => this.setState({ modalCancelarSuscripcion: false, motivoModificado: false, motivoCancelacion: null, modalPage: 1})}>Ok</PaperButton>
                    </Dialog.Actions>
                </>
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
        const {themedStyle, profile} = this.props;
        const { visible, changePasswordSuccess} = this.state;
        const family_name = (profile['http://closely.com/user_metadata'].family_name) ? profile['http://closely.com/user_metadata'].family_name : profile.family_name;
        const given_name = (profile['http://closely.com/user_metadata'].given_name) ? profile['http://closely.com/user_metadata'].given_name : profile.given_name;
        const profilePicture = (profile['http://closely.com/user_metadata'].picture) ? profile['http://closely.com/user_metadata'].picture : profile.picture;

        return (
            <Layout style={{flex: 1}}>
                <ProfileHeader />                
                <ScrollView
                contentContainerStyle={{ flexGrow: 1, flexDirection: 'column' }}
                bounces={false}
                bouncesZoom={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                style={themedStyle.container}>  
                <Portal>
                    <Dialog
                        visible={this.state.modalCancelarSuscripcion}
                        dismissable={this.state.modalPage < 3 ? true : false}
                        onDismiss={this.state.modalPage < 3 ? () => this.setState({ modalCancelarSuscripcion: false }) : null}
                    >
                        {this.renderModalContent()}
                    </Dialog>
                </Portal>                                      
                <Layout style={{backgroundColor: 'transparent'}}>
                    <Layout style={themedStyle.photoSection}>
                        <ProfilePhoto 
                        style={themedStyle.photo}
                        source={{uri: profilePicture}}
                        button={this.renderPhotoButton}
                        />
                        <Layout style={themedStyle.nameSection}>
                            <Layout style={themedStyle.editableSection}>
                                <ProfileSetting 
                                style={[themedStyle.profileSetting, themedStyle.nameParameter]}
                                value={given_name}
                                />    
                                <TouchableOpacity onPress={this.modificarNombre}>
                                    <Icon name='edit-outline' tintColor={themedStyle.iconColor.color} style={{height: 20, width: 20, marginLeft: 10}} />
                                </TouchableOpacity>                           
                            </Layout>
                            <Layout style={themedStyle.editableSection}>                                
                                <ProfileSetting 
                                style={[themedStyle.profileSetting, themedStyle.nameParameter, themedStyle.lastNameParameter]}
                                value={family_name}
                                />
                                <TouchableOpacity onPress={this.modificarApellido}>
                                    <Icon name='edit-outline' tintColor={themedStyle.iconColor.color} style={{height: 20, width: 20, marginLeft: 10}} />
                                </TouchableOpacity>
                            </Layout>                            
                        </Layout>                                                
                    </Layout>
                    <Layout style={themedStyle.infoSection}>
                        <ProfileSetting 
                        style={themedStyle.profileSetting}
                        hint='Email'
                        value={profile.email}
                        />
                    </Layout>
                </Layout>  

                <Layout style={themedStyle.actionsSection}>
                    <TouchableOpacity
                        onPress={this.consultarHistorialAlertas}>
                            <Layout
                            style={[
                                themedStyle.actionContainer,
                                themedStyle.profileSetting
                            ]}>
                                <Text
                                style={Textstyles.caption2}
                                appearance='hint'>
                                    Historial de Alertas
                                </Text>                                                      
                            </Layout>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.consultarHistorialSeguimientos}>
                        <Layout
                        style={[
                            themedStyle.actionContainer,
                            themedStyle.profileSetting
                        ]}>
                            <Text
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Historial de Seguimientos
                            </Text>                                                  
                        </Layout>
                    </TouchableOpacity>
                </Layout>        
                    
                    
                <Layout style={[themedStyle.actionsSection, {marginTop: 0}]}>
                    <TouchableOpacity onPress={async () => await Linking.openSettings()}>
                        <Layout
                        style={[
                            themedStyle.actionContainer,
                            themedStyle.profileSetting
                        ]}>
                            <Text
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Configurar Permisos
                            </Text>                                                  
                        </Layout>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ModificarCodigo')}>
                        <Layout
                        style={[
                            themedStyle.actionContainer,
                            themedStyle.profileSetting
                        ]}>
                            <Text
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Cambiar Código de Seguridad
                            </Text>                                                  
                        </Layout>
                    </TouchableOpacity>
                    {profile.sub.startsWith('auth0') &&
                    <TouchableOpacity onPress={this._cambiarContrasena}>
                        <Layout
                        style={[
                            themedStyle.actionContainer,
                            themedStyle.profileSetting
                        ]}>
                            <Text
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Cambiar Contraseña
                            </Text>                                                  
                        </Layout>
                    </TouchableOpacity>}                    
                    <TouchableOpacity
                    onPress={this.showCancelarSuscriptionDialog}>
                        <Layout
                        style={[
                            themedStyle.actionContainer,
                            themedStyle.profileSetting
                        ]}>
                            <Text
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Cancelar Suscripción
                            </Text>                      
                            
                        </Layout>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={this.cerrarSesion}>
                        <Layout
                        style={[
                            themedStyle.actionContainer,
                            themedStyle.profileSetting
                        ]}>
                            <Text
                            style={themedStyle.cerrarSesionLabel}
                            appearance='hint'>
                                Cerrar Sesion
                            </Text>                      
                            
                        </Layout>
                    </TouchableOpacity>                        
                </Layout>              
                </ScrollView>
                <Modal
                    backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                    onBackdropPress={() => {
                        if (this.state.changePasswordSuccess != null) this.setState({visible: false, changePasswordSuccess: null});
                    }}
                    visible={visible}>
                        {changePasswordSuccess === null && 
                        <Card style={{justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                            <Spinner />
                            <Text>Espere un momento...</Text>
                        </Card>}
                        {changePasswordSuccess === true &&
                        <Card 
                            header={() => (<CardHeader title='Revise su correo' />)}
                            status='success'
                            style={{width: '90%'}}>
                            <Text>Se le ha enviado un correo a su bandeja de entrada para que pueda cambiar su contraseña</Text>
                        </Card>}
                        {changePasswordSuccess === false && 
                        <Card 
                            header={() => (<CardHeader title='Error' />)}
                            status='danger'>
                            <Text>Ha ocurrido un error, intente nuevamente mas tarde.</Text>
                        </Card>}

                </Modal>
            </Layout>    
        
        );

    }
}

PerfilUsuarioScreen.navigationOptions = {header: null,};

const pantalla = withStyles(PerfilUsuarioScreen, (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-2'],
    },
    photoSection: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 10,
        backgroundColor: theme['background-basic-color-1'],
    },
    nameSection: {
        flex: 1,
        marginLeft: 32,
    },
    editableSection: {
        flexDirection: 'row',
        alig: 'center',
        alignItems: 'center',
    },
    infoSection: {
        marginTop: 24,
        justifyContent: 'flex-start',
        backgroundColor: theme['background-basic-color-1'],
    },
    actionsSection: {
        marginTop: 24,
        backgroundColor: theme['background-basic-color-1'],
        justifyContent: 'flex-start',
        marginBottom: 24
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
    profileSetting: {
        borderBottomWidth: 1,
        borderBottomColor: theme['border-basic-color-2'],
    },
    nameParameter: {
        paddingHorizontal: 0,
        paddingVertical: 8,
        flexGrow: 1
    },
    lastNameParameter: {
        marginVertical: 16,
    },
    cerrarSesionLabel: {
        color: theme['color-danger-600'],
        alignSelf: 'flex-start'
    },
    iconColor: {
        color: theme['color-primary-active'],
    },
    photoButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        transform: [{ translateY: 50 }],
        borderColor: theme['border-basic-color-4'],
        backgroundColor: theme['background-basic-color-4'],
      },
}))

const mapStateToProps = state => {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps, {
    logOut,
    modificarDatosPerfil,
    cambiarFotoPerfil
})(pantalla)