import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules } from 'react-native';
import axios from 'axios';
import firebase from 'react-native-firebase';

import { notificacionesEndpoint, auth0, eventosEndpoint } from '../../api';

export const saveToken = (token) => {
    return {
        type: 'SAVE_TOKEN',
        payload: token
    };
};

export const removeToken = () => {
    return {
        type: 'REMOVE_TOKEN'
    };
};

export const error = error => {
    return {
        type: 'ERROR',
        payload: error
    };
};

export const getUserState = () => async dispatch => {
    await axios.get(`${eventosEndpoint}/api/usuarios`)
        .then(response => {
            if (response.data.usuarioEstado !== 'Tranquilo') {
                if (response.data.usuarioEstado === 'En Seguimiento') {
                    dispatch({ type: 'INICIAR_SEGUIMIENTO', payload: response.data.evento })
                }
                else {
                    dispatch({ type: 'NUEVO_EVENTO', payload: response.data.evento});
                }
                
            }
        }).catch(err => {throw new Error(err.message)});
}

export const getUserToken = () => async dispatch => {
    const t = await AsyncStorage.getItem('token');
    if (t !== null) {
        const token = JSON.parse(t);            
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
        dispatch(saveToken(token));
        await getFcmToken().then(fcmToken => {
            axios.post(`${notificacionesEndpoint}/api/register/notifications`, {ApiKey: fcmToken});
        }).catch((err) => console.log(err.message));
    }
}

export const logIn = () => async dispatch => {
    await auth0.webAuth.authorize({
        scope: 'openid profile email offline_access identities',
        audience: 'https://www.closely.com',
        prompt: 'login',
        language: 'es',
    })
    .then(async credentials => {
        console.log(credentials);
        await dispatch(storeToken(credentials));
        await getFcmToken().then(fcmToken => {
            axios.post(`${notificacionesEndpoint}/api/register/notifications`, { ApiKey: fcmToken });
        });
    })
    .catch(error => { throw new Error(error)});
}

export const facebookLogIn = () => async dispatch => {
    await auth0.webAuth.authorize({
        scope: 'openid profile email offline_access identities',
        audience: 'https://www.closely.com',
        connection: 'facebook',
        prompt: 'login',
        language: 'es',
    })
    .then(async credentials => {
        console.log(credentials);
        await dispatch(storeToken(credentials));
        await getFcmToken().then(fcmToken => {
            axios.post(`${notificacionesEndpoint}/api/register/notifications`, { ApiKey: fcmToken });
        });
    })
    .catch(error => { throw new Error(error)});
}

export const googleLogIn = () => async dispatch => {
    await auth0.webAuth.authorize({
        scope: 'openid profile email offline_access identities',
        audience: 'https://www.closely.com',
        connection: 'google-oauth2',
        prompt: 'login',
        language: 'es',
        
    })
    .then(async credentials => {
        console.log(credentials);
        await dispatch(storeToken(credentials));
        await getFcmToken().then(fcmToken => {
            axios.post(`${notificacionesEndpoint}/api/register/notifications`, { ApiKey: fcmToken });
        });
    })
    .catch(error => { throw new Error(error) });
}

export const logOut = (refreshToken) => async (dispatch, getState) => {
    await auth0.webAuth.clearSession()
    .then(async () => {
        if (await AsyncStorage.removeItem('token')) {
            dispatch(removeToken());
        }
        await getFcmToken().then(fcmToken => {
            axios.delete(`${notificacionesEndpoint}/api/register/notifications`, { data: {ApiKey: fcmToken} });
        })
    })
    .catch(err => console.log(err));
};

export const storeToken = authResult => async dispatch => {
    await AsyncStorage.setItem('token', JSON.stringify(authResult))
    .then(() => {
        setTokenBD(authResult)
        axios.defaults.headers.common['Authorization'] = `Bearer ${authResult.accessToken}`;
        dispatch(saveToken(authResult));
    })
    .catch((err) => console.log(err.message));
}

const setTokenBD = (authResult) => {
    NativeModules.BdModule.setToken(
        authResult.accessToken, 
        authResult.refreshToken, 
        authResult.idToken)
        .then((val) => console.log(val)).catch( () => console.log("Hubo un error"));        
}

const getFcmToken = () => {
    return checkPermission()
}

async function checkPermission(){
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      return tomarToken();
    } else {
      return requestPermission();
    }
}

async function tomarToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
    return fcmToken
}

async function requestPermission(){
    try {
        await firebase.messaging().requestPermission();
        return tomarToken();
    } catch (error) {
        console.log('permission rejected');
    }
}