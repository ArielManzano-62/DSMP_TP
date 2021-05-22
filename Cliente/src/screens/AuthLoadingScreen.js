import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View, NativeModules, PermissionsAndroid} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import SplashScreen from 'react-native-splash-screen'

import {eventosEndpoint} from '../api';
import { getUserToken, getUserState } from '../redux/actions';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        try {
            await this.props.getUserToken()
            if (!this.props.token.isSignedIn) {
                this.props.navigation.navigate('SignedOut');
            } else {
                try {
                    this.updateToken(this.props.token)
                    await axios.get(`${eventosEndpoint}/api/suscripciones`);
                    try {
                        await axios.get(`${eventosEndpoint}/api/usuarios/codigo-seguridad`);                        
                        await this.props.getUserState()
                        if (!this.props.evento.isInEvent) {
                            if (!this.props.seguimiento.isInSeguimiento) {
                                this.props.navigation.navigate('SignedIn');
                            } else {
                                this.props.navigation.navigate('EnSeguimiento')
                            }
                            
                        } else {
                            this.props.navigation.navigate('EnEvento');
                        }
                    } catch (error) {
                        this.props.navigation.navigate('CodigoSeguridad');
                    }
                } catch (err) {
                    this.props.navigation.navigate('Suscripcion');
                }                 
            }
        } catch (error) {
            console.log(error.message)
        }       
            
    }

    updateToken = (token) => {
        console.log("---------------------------------------------------------------")
        console.log(token.token)
        accessToken = token.token.accessToken
        idToken = token.token.idToken
        refreshToken = token.token.refreshToken
        NativeModules.BdModule.setToken(accessToken, refreshToken, idToken).then((val) => console.log(val)).catch( () => console.log("Hubo un error"));
    }

    componentWillUnmount() {
        console.log("UNMNOUNT")
        SplashScreen.hide();
    }

    render() {
        return(
            <View style={styles.container}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapStateToProps = (state) => {
    return { 
        token: state.accessToken,
        evento: state.evento,
        seguimiento: state.ruta,
    };
}


export default connect(
    mapStateToProps,
    { getUserToken, getUserState }
)(AuthLoadingScreen);