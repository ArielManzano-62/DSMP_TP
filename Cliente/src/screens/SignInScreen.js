import React, { Component } from 'react';
import { Dimensions, ImageBackground , Image} from 'react-native';
import { Layout, Text, Button, Icon, Spinner,  withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import axios from 'axios';

import {eventosEndpoint} from '../api';
import { logIn, facebookLogIn, googleLogIn, getUserState } from '../redux/actions';
import TextStyle from '../constants/TextStyles';

var {height, width} = Dimensions.get('window');

const FacebookIcon = (style) => (
<   Icon name='facebook' {...style} />
);

const GoogleIcon = (style) => (
    <Icon name='google' {...style} />
);

class SignInScreen extends Component {
    constructor(props) {
        super(props) ; 
        
        this.state = {
            renderSpinner: false,
            spinnerLabel: null,

        }
    } 
    
    validateAppState = async () => {        
        await axios.get(`${eventosEndpoint}/api/suscripciones`)
        .then(async () => {
            await axios.get(`${eventosEndpoint}/api/usuarios/codigo-seguridad`)
            .then(async () => {
                await this.props.getUserState()
                .then(() => {
                    this.setState({spinnerLabel: 'Iniciando...'})
                    setTimeout(() => {
                        if (!this.props.isInEvent) {
                            this.props.navigation.navigate('SignedIn');
                        } else {
                            this.props.navigation.navigate('EnEvento');
                        }
                    }, 2000)
                })                
            }).catch((err) => {
                this.setState({spinnerLabel: 'Iniciando...'})
                setTimeout(() => {
                    this.props.navigation.navigate('CodigoSeguridad')
                }, 2000)                
            });
        })
        .catch((err) => {
            console.log(err);
            this.props.navigation.navigate('Suscripcion');
        });
    }


    _logIn = async () => {
        this.setState({ renderSpinner: true});
        setTimeout(async () => {
            await this.props.logIn()
            .then(async () => {
                setTimeout(async () => {
                    this.setState({ spinnerLabel: 'Cargando...'});
                    await this.validateAppState();
                }, 1000)
                
            }).catch((err) => this.setState({ renderSpinner: false}));
        }, 1000)
               
    }

    _facebookLogIn = async () => {
        this.setState({ renderSpinner: true});
        setTimeout(async () => {
            await this.props.facebookLogIn()
            .then(async () => {
                setTimeout(async () => {
                    this.setState({ spinnerLabel: 'Cargando...'});
                    await this.validateAppState();
                }, 1000)
            }).catch((err) => this.setState({ renderSpinner: false})); 
        }, 1000)
           
    }

    _googleLogIn = async () => {
        this.setState({ renderSpinner: true});
        setTimeout(async () => {
            await this.props.googleLogIn()
            .then(async () => {
                setTimeout(async () => {
                    this.setState({ spinnerLabel: 'Cargando...'});
                    await this.validateAppState();
                }, 1000)
            }).catch((err) => this.setState({ renderSpinner: false}));
        }, 1000)
            
    }

    renderBottomContainer = () => {
        const { themedStyle } = this.props;

        if (!this.state.renderSpinner) {
            return (
                <Layout style={themedStyle.formContainer} level='4'>
                    <Layout style={themedStyle.socialLogInContainer}>
                        
                        <Button 
                        icon={GoogleIcon}
                        style={{backgroundColor: '#ff5733', borderColor: '#ff5733', alignSelf: 'stretch', marginTop: height * 0.01}}
                        onPress={() => this._googleLogIn()}>
                            Iniciar Sesión con Google
                        </Button>
                        <Button 
                        icon={FacebookIcon}
                        style={{backgroundColor: '#3b5998', borderColor: '#3b5998', alignSelf: 'stretch', marginTop: height * 0.01}}
                        onPress={() => this._facebookLogIn()}>
                            Iniciar Sesión con Facebook
                        </Button>
                    </Layout>
                    <Layout style={themedStyle.dividerContainer}>
                        <Layout style={themedStyle.divider}/>
                        
                    </Layout>
                    
                    <Layout style={themedStyle.buttonContainer}> 
                                                
                        <Button 
                        //textStyle={textStyle.button}
                        style={{alignSelf: 'stretch', marginVertical: height * 0.01}}
                        onPress={() => this._logIn()}
                        >                        
                            Iniciar Sesión con Closely
                        </Button>
                        <Button 
                        style={themedStyle.registrarseText} 
                        textStyle={themedStyle.registrarseText} 
                        appearance='ghost'
                        onPress={() => this.props.navigation.navigate('SignUp')}
                        >
                            ¿No tienes Cuenta? Registrate Aquí
                        </Button>
                    </Layout>                    
                </Layout>
            );
            
        }
        else {
            return (
                <Layout style={themedStyle.formContainer} level='4'>
                    <Spinner size='giant' status='primary' />
                    {this.state.spinnerLabel ?
                    <Text
                    category='c1'
                    style={{marginTop: 10}}
                    >
                        {this.state.spinnerLabel}
                    </Text> :
                    null 
                    }                    
                </Layout>
            );
        }
    }
    


    render() {
        const { themedStyle } = this.props;

        return (
            <Layout style={{flex: 1}}>            
                <Layout style={themedStyle.headerContainer}>
                    <Layout style={themedStyle.imageContainer}>
                        <ImageBackground style={themedStyle.image} source={require('../assets/images/alceLogin.png')} />
                    </Layout>

                    <Layout style={themedStyle.headerLabelContainer}>
                        <Text style={themedStyle.headerLabel} category='h1'>Closely</Text>
                    </Layout>                    
                </Layout>
                {this.renderBottomContainer()}
                
            </Layout>
        );
    }
}


SignInScreen.navigationOptions = {
header: null,
};

const mapStateToProps = state => {
return { 
    signedIn: state.accessToken.isSignedIn,
    isInEvent: state.evento.isInEvent
    };
}

export default connect(
mapStateToProps,
{ logIn, facebookLogIn, googleLogIn, getUserState }
)(withStyles(SignInScreen, (theme) => {
return ({        
    headerContainer: {        
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme['background-primary-color-1']
    },
    formContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: theme['background-basic-color-2']
    },
    socialLogInContainer: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: theme['background-basic-color-2'],
        marginBottom: height * 0.02
    },
    buttonContainer: {
        flex: 3,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: theme['background-basic-color-2'],
        alignSelf: 'stretch', 
        marginBottom: height * 0.02
    },
    imageContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingLeft: width * 0.05,            
        backgroundColor: theme['background-primary-color-1']
    },
    image: {
        width: width * 0.4,
        height: height * 0.3,
    },
    headerLabelContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme['background-primary-color-1'],
        //marginBottom: height * 0.05
    },
    headerLabel: {
        color: theme['text-control-color'],
        //marginTop: height * 0.05,
        ...TextStyle.logo
    },
    registrarseText: {
        color: theme['text-hint-color'],
        ...TextStyle.subtitle,
    },
    dividerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        //marginHorizontal: 16,
        backgroundColor: theme['background-basic-color-2'],
        marginBottom: height * 0.01
        //marginTop: 52,
    },
    orLabel: {
        marginHorizontal: 8,
        ...TextStyle.subtitle,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: theme['background-basic-color-4'],
    },
});
}));

