import React from 'react';
import { ScrollView, TouchableOpacity, Dimensions, View, Text as RNText, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

import {
    Layout, withStyles, Button, Text, Icon, Avatar, TopNavigation, TopNavigationAction, Spinner, Modal, Card, CardHeader
} from '@ui-kitten/components';
import { Portal, Dialog, Button as PaperButton, Paragraph, Switch} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

import ProfilePhoto from '../components/ProfilePhoto';
import ProfileSetting from '../components/ProfileSetting';
import GrupoHeader from '../components/header/GrupoHeader';
import jwtDecode from 'jwt-decode';
import Textstyles from '../constants/TextStyles';
import { abandonarGrupo, cambiar_foto_grupo, eliminar_integrante } from '../redux/actions';
import { eventosEndpoint } from '../api';
import TextStyles from '../constants/TextStyles';
import axios from 'axios';

var {height, width} = Dimensions.get('window');

const CameraIconFill = (style) => {
    return (
        <Icon name='camera' {...style}/>
    );
}

const ArrowBackFill = (style, color) => {
    return (
        <Icon name='arrow-ios-back' {...style} tintColor={color}/>
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

class DetalleGrupoScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPopUpAbandonarGrupo: false,
            showPopUpConfigurarAlerta: false,
            alertas: {
                asalto: true,
                emergenciaMedica: false,
                incendio: false,
            },
            subiendoFoto: false,
            visible: false,
            integrante: null,
            eliminando: false,
        }

        this.id = jwtDecode(this.props.token).sub;
    }

    onPhotoButtonPress = () => {
        ImagePicker.showImagePicker(imagePickerOptions, async (response) => {
            try {
                this.setState({subiendoFoto: true});
                await this.props.cambiar_foto_grupo(response.uri, response.type, response.fileName, this.props.grupo.grupoId);
                this.setState({subiendoFoto: false});
            } catch (error) {
                console.log(error);
            }
        })
    }

    componentWillUnmount() {
        console.log("UNMOUNTING");
    }

    renderPhotoButton = () => {
        const { themedStyle } = this.props;
    
        return (
          <Button
            style={themedStyle.photoButton}
            activeOpacity={0.95}
            icon={CameraIconFill}
            onPress={this.onPhotoButtonPress}
          />
        );
      };

    renderAppBar = () => {
        return (
            <GrupoHeader 
            nombreGrupo={this.props.grupo.grupoNombre}
            onBack={() => this.props.navigation.pop()}            
            right={false}
            />
        )
    }

    showAbandonarPopUp = () => {
        this.setState({ showPopUpAbandonarGrupo: true});
    }

    renderModal = () => {
        const { themedStyle } = this.props;
        return (                
            <Layout style={themedStyle.modalAbandonar}>
                <Text>Holaa</Text>
            </Layout>
        );
        
    }

    abandonarGrupo = async () => {
        const { grupo } = this.props;

        this.setState({ showPopUpAbandonarGrupo: false})
        await this.props.abandonarGrupo(grupo.grupoId, this.id);
        this.props.navigation.popToTop();
        
        
    }

    consultarHistorialSeguimientos = () => {
        this.props.navigation.navigate('HistorialSeguimientosGrupo');
    }

    consultarHistorialAlertas = () => {
        this.props.navigation.navigate('HistorialAlertasGrupo');
    }

    configurarAlertas = async () => {
        const { grupo } = this.props;
        const { asalto, emergenciaMedica, incendio} = this.state.alertas;

        await axios.post(`${eventosEndpoint}/api/grupos/configurar`, {
            grupoId: grupo.grupoId,
            asalto,
            emergenciaMedica,
            incendio
        }).then(() => this.setState({showPopUpConfigurarAlerta: false}))
        .catch((err) => /*Manejar Error*/console.log(err));
    }

    obtenerConfiguracionAlertas = async () => {
        const { grupo } = this.props;
        await axios.get(`${eventosEndpoint}/api/grupos/configurar/${grupo.grupoId}`)
        .then((response) => {
            const {asalto, emergenciaMedica, incendio} = response.data;
            this.setState({alertas: {
                asalto,
                emergenciaMedica,
                incendio
            }});
        })
        .catch(err => { throw new Error(err)});
        this.setState({ showPopUpConfigurarAlerta: true});
    }

    _eliminarIntegrante = async () => {
        this.setState({eliminando: true});
        try {
            await this.props.eliminar_integrante(this.props.grupo.grupoId, this.state.integrante.id)
        } catch( error ) {
            console.log(error);            
        } finally {
            this.setState({eliminando: false, visible: false, integrante: null});
        }
    }

    _resetModal = () => {
        this.setState({visible: false, integrante: null});
    }

    renderDialog = () => {
        const { themedStyle } = this.props;

        if (this.state.showPopUpAbandonarGrupo) {
            return (
                <Dialog
                visible={this.state.showPopUpAbandonarGrupo}
                onDismiss={() => this.setState({ showPopUpAbandonarGrupo: false })}>
                    <Dialog.Content>
                        <Paragraph>¿Está seguro que desea abandonar el grupo?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={() => this.setState({ showPopUpAbandonarGrupo: false })}>
                            Cancelar
                        </PaperButton>
                        <PaperButton onPress={() => this.abandonarGrupo()}>
                            Salir
                        </PaperButton>
                    </Dialog.Actions>
                </Dialog>
            );
        }
        if (this.state.showPopUpConfigurarAlerta){
            return (
                <Dialog
                visible={this.state.showPopUpConfigurarAlerta}
                onDismiss={() => this.setState({ showPopUpConfigurarAlerta: false })}>
                    <Dialog.Title>
                        <Paragraph>Seleccione los Tipos de Alertas que quiere enviar a este grupo</Paragraph>
                    </Dialog.Title>
                    <Dialog.Content>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <RNText
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Asalto
                            </RNText> 
                            <Switch 
                            value={this.state.alertas.asalto}
                            onValueChange={() => this.setState({alertas: {...this.state.alertas, asalto: !this.state.alertas.asalto}})}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <RNText
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Emergencia Medica
                            </RNText> 
                            <Switch 
                            value={this.state.alertas.emergenciaMedica}
                            onValueChange={() => this.setState({alertas: {...this.state.alertas, emergenciaMedica: !this.state.alertas.emergenciaMedica}})}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <RNText
                            style={Textstyles.caption2}
                            appearance='hint'>
                                Incendio
                            </RNText> 
                            <Switch 
                            value={this.state.alertas.incendio}
                            onValueChange={() => this.setState({alertas: {...this.state.alertas, incendio: !this.state.alertas.incendio}})}
                            />
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={() => this.setState({ showPopUpConfigurarAlerta: false})}>
                            Cancelar
                        </PaperButton>
                        <PaperButton onPress={() => this.configurarAlertas()}>
                            Guardar
                        </PaperButton>
                    </Dialog.Actions>
                </Dialog>
            );
        }
        
    }

    _onBack = () => {
        this.props.navigation.pop();
    }

    renderLeftControl = (color) => {
        return (
          <TopNavigationAction
                icon={(style) => ArrowBackFill(style, color)}
                onPress={this._onBack}            
          />
        );
    };

    renderHeader = () => {
        const { themedStyle } = this.props;
        return (
            <TopNavigation 
                style={themedStyle.headerContainer}
                title={this.props.grupo ? this.props.grupo.grupoNombre : ''}
                titleStyle={themedStyle.title}
                alignment='center'
                leftControl={this.renderLeftControl(themedStyle.icon.color)}               

            />
        );
    }

    renderIntegrantes = () => {
        const {themedStyle, grupo, theme} = this.props;

        let integrantesList = []

        if (!grupo) return;
        
        grupo.integrantes.forEach((i) => {
            integrantesList.push(
                <Layout style={themedStyle.integranteItem} key={i.Id}>
                    <Layout style={{flex: 1, paddingVertical: 5, justifyContent: 'flex-start', alignItems: 'center',  backgroundColor: 'transparent'}}>
                        <Avatar shape='round' source={{uri: i.fotoUrl}}/>
                    </Layout>
                    <Layout style={{flex: 4, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'transparent'}}>
                        <Text category='s2' style={{marginBottom: '1%'}}>{i.nombre} {i.apellido}</Text>
                        <Text category='c1' appearance='hint'>{i.email}</Text>
                    </Layout>
                    <Layout style={{flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                        {grupo.administrador.id ==i.id ?
                        <Layout style={{ borderRadius: 5, borderColor: themedStyle.color.colorSuccessBorder, borderWidth: 1, backgroundColor: themedStyle.color.colorSuccessBackground, paddingHorizontal: 2.5}}>
                            <Text category='c2' style={{color: themedStyle.color.colorSuccessBorder}}>Administrador</Text>
                        </Layout> : (grupo.administrador.id === this.id ?  
                        <TouchableOpacity onPress={() => this.setState({visible: true, integrante: i})}>
                            <Icon name='trash-2-outline' width={24} height={24} tintColor={theme['color-danger-default']}/>
                        </TouchableOpacity>                      
                            
                         : null)}                        
                    </Layout> 
                </Layout>
            );
        })

        return integrantesList;
        
    }

    renderModalElement = () => {        
        const {integrante} = this.state;

        const Header = () => (
            <CardHeader
                title='Eliminar Integrante'
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
                        onPress={this._eliminarIntegrante}>
                        ELIMINAR
                    </Button>
                </Layout>
            )}

        return (
            <Card header={Header} footer={this.state.eliminando ? null : Footer} style={{width: width * 0.95}}>
                {this.state.eliminando ?
                <Layout style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner />
                    <Text>Eliminando...</Text>
                </Layout> : <Text>{`¿Está seguro que desea eliminar a ${integrante.nombre} ${integrante.apellido}?`}</Text>}
            </Card>
        );        
    }

    render() {
        const {themedStyle, theme, grupo} = this.props;

        if (!grupo) return null; 
        return (
                <Layout style={{flex: 1}}>
                    {this.renderHeader()}
                    <ScrollView
                    bounces={false}
                    bouncesZoom={false}
                    alwaysBounceVertical={false}
                    alwaysBounceHorizontal={false}
                    style={themedStyle.container}
                    >
                        
                        <Portal>
                            {this.renderDialog()}
                        </Portal>
                        <Modal
                        backdropStyle={themedStyle.backdrop}
                        onBackdropPress={this._resetModal}
                        visible={this.state.visible}>
                            {this.state.visible && this.renderModalElement()}
                        </Modal>
                        <Layout style={themedStyle.photoSection} key='picture'>
                            <ProfilePhoto 
                            style={themedStyle.photo}
                            shape='square'
                            source={this.props.grupo ? {uri: this.props.grupo.fotoUrl} : null}
                            button={grupo.administrador.id === this.id ? (this.state.subiendoFoto ? () => (<Spinner  />) : this.renderPhotoButton) : null}
                            />
                        </Layout>
                        <Layout style={themedStyle.infoSection} key='info'>
                            <ProfileSetting 
                            style={themedStyle.profileSetting}
                            hint='Nombre del Grupo'
                            value={this.props.grupo ? this.props.grupo.grupoNombre : ""}
                            />
                        </Layout> 
                        <Layout style={themedStyle.integrantesSection} key='integrantes'>
                            {grupo.administrador.id === this.id && <Layout style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8, backgroundColor: theme['background-basic-color-2']}}>
                                <Text style={{color: theme['color-primary-400']}}>Añadir Integrante</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('AgregarIntegrante')}>
                                    <Icon name='plus-outline' height={24} width={24} tintColor={theme['color-primary-400']}/>
                                </TouchableOpacity>
                            </Layout>}
                            {this.renderIntegrantes()}
                        </Layout>                                       
                        <Layout style={themedStyle.actionsSection} key='actions'>
                            <TouchableOpacity
                            onPress={this.obtenerConfiguracionAlertas}>
                                <Layout
                                style={[
                                    themedStyle.actionContainer,
                                    themedStyle.profileSetting
                                ]}>
                                    <Text
                                    style={Textstyles.caption2}
                                    appearance='hint'>
                                        Configurar Alertas
                                    </Text>                         
                                    
                                </Layout>
                            </TouchableOpacity>
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
                            <TouchableOpacity
                            onPress={this.consultarHistorialSeguimientos}>
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
                            <TouchableOpacity
                            onPress={this.showAbandonarPopUp}>
                                <Layout
                                style={[
                                    themedStyle.actionContainer,
                                    themedStyle.profileSetting
                                ]}>
                                    <Text
                                    style={themedStyle.abandonarGrupoLabel}
                                    appearance='hint'>
                                        Abandonar Grupo
                                    </Text>                         
                                    
                                </Layout>
                            </TouchableOpacity>                        
                        </Layout>             
                            
                    </ScrollView>
                </Layout>    
                
        );
        
    }
}

DetalleGrupoScreen.navigationOptions = { header: null, tabBarVisible: false };

const screen = withStyles(DetalleGrupoScreen, (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-2'],
    },
    photoSection: {
        
        backgroundColor: theme['background-basic-color-2'],
    },
    integrantesSection: {
        marginTop: 24,
    },
    infoSection: {
        borderTopWidth: 1,
        borderTopColor: theme['border-basic-color-2'],
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
    integranteItem: {
        paddingHorizontal: '2%',
        paddingVertical: '2%', 
        borderBottomWidth: 1, 
        borderBottomColor: theme['border-basic-color-2'],
        flexDirection: 'row'
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    photo: {
        width: '100%',
        height: 400,
        alignSelf: 'center',
        backgroundColor: theme['background-basic-color-2'],
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
        width: 48,
        height: 48,
        borderRadius: 24,
        transform: [{ translateY: 350 }, {translateX: -5}],
        borderColor: theme['border-basic-color-4'],
        backgroundColor: theme['background-basic-color-4'],
      },
      color: {
        colorSuccessBorder: theme['color-success-900'],
        colorSuccessBackground: theme['color-success-200'],
      },
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
    photoSpinner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        transform: [{ translateY: 350 }, {translateX: -5}]
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
      
}));

const mapStateToProps = state => {
    return {
        grupo: state.grupoSeleccionado,
        token: state.accessToken.token.idToken
    }
}

export default connect( mapStateToProps, {
    abandonarGrupo,
    cambiar_foto_grupo,
    eliminar_integrante
})(screen);