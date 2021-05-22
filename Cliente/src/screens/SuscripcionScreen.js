import React from 'react';
import { Dimensions, Text as RNText, View} from 'react-native';
import {WebView} from 'react-native-webview';
import { 
    Button,
    Layout, 
    Text,
    Icon,
    Spinner,    
    withStyles,
} from '@ui-kitten/components';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUserState, logOut } from '../redux/actions'

import {eventosEndpoint} from '../api';
import TextStyles from '../constants/TextStyles';

var {width, height} = Dimensions.get('window');

class SuscripcionScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            approveLink: null,
            suscripcionId: null,
            showWebView: false,
            renderSpinner: false,
            renderPaymentSuccess: false,
            renderVerification: false,
            renderPaymentFailed: false,
            button: true,
        }
    }

    crearSuscripcion = async () => {
        this.setState({ renderSpinner: true, button: false});
        setTimeout(async () => {
            await axios.post(`${eventosEndpoint}/api/suscripciones`)
            .then(response => {
                console.log(response.data);
                this.setState({ approveLink: response.data.approveLink, showWebView: true, suscripcionId: response.data.suscripcionId});
            })
            .catch(err => this.setState({renderSpinner: false, button: true}));
            
        }, 1000)
        
        
    }

    handleResponse = (data) => {
        if (data.title === 'success') {
            this.setState({ showWebView: false, renderVerification: true });
            axios.put(`${eventosEndpoint}/api/suscripciones/${this.state.suscripcionId}`)
            .then(async () => {
                this.setState({ renderPaymentSuccess: true, renderSpinner: false});
                setTimeout(async () => {
                    await axios.get(`${eventosEndpoint}/api/usuarios/codigo-seguridad`)
                    .then(async () => {
                        await this.props.getUserState()
                        .then(() => {                            
                            if (!this.props.isInEvent) {
                                this.props.navigation.navigate('SignedIn');
                            } else {
                                this.props.navigation.navigate('EnEvento');
                            }
                        })
                    })
                    .catch((err) => {console.log(err); this.props.navigation.navigate('CodigoSeguridad')});
                }, 1000)           
                
            })
            .catch((err) => {
                this.setState({ renderSpinner: false, renderPaymentFailed: true});
                setTimeout(() => {
                    this.setState({ renderPaymentFailed: false})
                }, 3000)
            });
        }            
        else if (data.title === 'cancel') {
            this.setState({ showWebView: false, renderSpinner: false, button: true});
        }
    }

    renderAction = () => {
        const { themedStyle } = this.props;

        if (!this.state.renderSpinner && !this.state.renderPaymentSuccess) {
            return (
                <Button appearance='filled' style={{alignSelf: 'stretch'}} onPress={this.crearSuscripcion}>
                    Suscribirse
                </Button>
            );
        }
        else if (this.state.renderSpinner) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner size='medium' status='primary' /> 
                {this.state.renderVerification ? <Text category='c2' style={{marginTop: 15}}>Verificando Pago...</Text> : null}
                </View>
                
            );            
        }
        else if (this.state.renderPaymentSuccess) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name='checkmark-circle' style={{width: 30, height: 30}} fill={themedStyle.iconFill.fill} />
                    <Text category='c2' style={{marginTop: 15}}>Verificado</Text>
                </View>                
            );            
        }
        else if (this.state.renderPaymentFailed) {
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='cross-circle-outline' style={{width: 30, height: 30}} fill={themedStyle.iconFill.fillFail} />
                <Text category='c2' style={{marginTop: 15}}>No se pudo verificar el pago, intente nuevamente en otro momento</Text>
            </View>
        }
    }

    render() {
        const { themedStyle, theme } = this.props;

        return (
            <Layout style={themedStyle.container}>
                <Layout style={themedStyle.welcomeContainer}>
                    <Text 
                    category='h2'
                    style={themedStyle.welcomeHeader}>
                        Bienvenido a Closely
                    </Text>
                </Layout>
                <Layout style={{flex: 1, justifyContent: 'flex-end', paddingBottom: '4%'}} level='2'>
                    {this.state.button && <Button 
                        style={{alignSelf: 'center'}} 
                        textStyle={themedStyle.registrarseText} 
                        appearance='ghost'
                        onPress={() => {
                            this.props.logOut()
                            .then(() => this.props.navigation.navigate('SignedOut'))
                            .catch(error => console.log(error))}}
                    >
                        Salir
                    </Button>}
                </Layout>
                <Layout                 
                    style={{position: 'absolute', top: '17%', left: '15%', right: '15%', bottom: '16%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <Layout elevation={10} style={themedStyle.centerCard}>
                        <Layout style={themedStyle.planContainer}>
                            <Layout style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                                <Text
                                category='h6'
                                style={themedStyle.planHeader}>
                                    Plan Único
                                </Text>
                            </Layout>                            
                            <Layout style={themedStyle.priceContainer}>
                                <Text
                                category='h4'
                                style={themedStyle.priceLabel}
                                >
                                    U$S 5.00
                                </Text>
                                <Text
                                category='s1'
                                appearance='hint'
                                style={{fontStyle: 'italic'}}>
                                    por mes
                                </Text>
                            </Layout>                            
                        </Layout>
                        <Layout style={themedStyle.descriptionContainer}>                            
                            <Text
                            category='p2'
                            style={themedStyle.descriptionText}>
                                Envío de posición, video y audio
                            </Text>
                            <Text
                            category='p2'
                            style={themedStyle.descriptionText}>
                                Acompañamiento Virtual
                            </Text>
                            <Text
                            category='p2'
                            style={themedStyle.descriptionText}>
                                Comunicación rápida y efectiva de emergencias
                            </Text>
                            {this.renderAction()}
                            
                        </Layout>
                        
                        
                    </Layout>

                </Layout>
                {this.state.showWebView && 
                <WebView
                    ref={v => this.web = v} 
                    containerStyle={{ position: 'absolute', height: '100%', width: '100%', bottom: 0, top: 0, right: 0, left: 0 }}                      
                    source={{uri: this.state.approveLink}}
                    onNavigationStateChange={data => this.handleResponse(data)}
                />}
            </Layout>
        );
    }
}

const pantalla = withStyles(SuscripcionScreen, (theme) => {
    return ({
        container: {
            flex: 1
        },
        welcomeContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 20,
            backgroundColor: theme['background-primary-color-2']
        },
        welcomeHeader: {
            color: theme['text-control-color'],
            marginTop: 20,
        },
        centerCard: {
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopWidth: 12,
            borderTopColor: theme['color-primary-300'],
        },
        planContainer: {
            flex: 2, 
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderBottomWidth: 1, 
            borderColor: theme['border-basic-color-5'],
        },
        descriptionContainer: {
            flex: 3,
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingHorizontal: 20
        },
        priceContainer: {
            flex: 4,
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        planHeader: {
            marginTop: 15,
            fontWeight: 'bold'
        },
        priceLabel: {
            fontWeight: '100',
            fontSize: 25,
            color: theme['color-success-600'],
            marginBottom: 5
        },
        descriptionText: {
            textAlign: 'center', 
            fontWeight: 'bold'
        },
        iconFill: {
            fill: theme['color-success-hover'],
            fillFail: theme['color-danger-hover']
        },
        registrarseText: {
            color: theme['text-hint-color'],
            ...TextStyles.subtitle,
            fontWeight: 'bold'
        },
    });
});

const mapStateToProps = state => {
    return { 
        isInEvent: state.evento.isInEvent
    };
}

export default connect(mapStateToProps, {getUserState, logOut})(pantalla);