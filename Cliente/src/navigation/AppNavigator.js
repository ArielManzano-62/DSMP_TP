import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginNavigator from './LoginNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import EnEventoScreen from '../screens/EnEventoScreen';
import SuscripcionScreen from '../screens/SuscripcionScreen';
import CodigoSeguridadScreen from '../screens/CodigoSeguridadScreen';
import EnSeguimientoScreen from '../screens/solicitud_seguimiento/EnSeguimientoScreen';
import ConfigurarPermisosScreen from '../screens/ConfigurarPermisosScreen';
import AppIntroScreen from '../screens/AppIntroScreen';


export default createAppContainer(
  createSwitchNavigator({
    SignedOut: { screen: LoginNavigator },
    SignedIn: { screen: MainTabNavigator },
    AuthLoading: { screen: AuthLoadingScreen },
    EnEvento: { screen: EnEventoScreen },    
    EnSeguimiento: { screen: EnSeguimientoScreen },
    Suscripcion: { screen: SuscripcionScreen},
    CodigoSeguridad: { screen: CodigoSeguridadScreen },
    ConfigurarPermisos: {screen: ConfigurarPermisosScreen},
    AppIntro: {screen: AppIntroScreen}
  },

  {
    initialRouteName: 'AuthLoading',
  })
);