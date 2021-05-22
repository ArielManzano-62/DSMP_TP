import {auth0} from '../../api';
import AsyncStorage from '@react-native-community/async-storage';
import { storeToken, logOut, saveToken } from '../actions';
import jwtDecode from 'jwt-decode';

var isRefreshing = false;

export const refreshToken = store => next => async action => {
    if (typeof action === 'function' && isRefreshing === false) {
        var token = store.getState().accessToken.token;
        var accessTokenExpirationDate = store.getState().accessToken.expirationDate;
        if (Object.entries(token).length === 0 && token.constructor === Object) {
            const t = await AsyncStorage.getItem('token');
            if (t) {
                token = JSON.parse(t);
                await store.dispatch(saveToken(token));
                accessTokenExpirationDate = jwtDecode(token.accessToken).exp;
            } else {
                return await next(action);
            }         
        }        
        const { refreshToken } = token;
        const refreshThreshold = new Date().getTime() + 300000;
        const expireDate = new Date(accessTokenExpirationDate * 1000).getTime();
        if (expireDate < refreshThreshold) {
            isRefreshing = true;
            try {
                const result = await auth0.auth.refreshToken({refreshToken, scope: 'openid profile email offline_access'});
                if (result) {
                    await store.dispatch(saveToken(result));
                    await store.dispatch(storeToken(store.getState().accessToken.token));
                }                
            } catch (error) {
                //El refresh token ya no es valido, o sea, no entro en la app en mucho tiempo
                await store.dispatch(logOut(refreshToken));                
            }
            isRefreshing = false;
        }
    }    
    await next(action);
}

export const logger = store => next => action => {
    console.log('dispatching ', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}