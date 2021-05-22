import React from 'react';
import { Platform, View } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import {
  Icon,
  Text,
  withStyles
} from '@ui-kitten/components';
import {
  connect
} from 'react-redux';
import Colors from '../constants/Colors';

import {
  fetch_seguimientos,
  fetchEventos
} from '../redux/actions';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CrearGrupoScreen from '../screens/CrearGrupo';
import SolicitudSeguimientoScreen from '../screens/solicitud_seguimiento/SolicitudSeguimientoScreen';
import ListGrupoScreen from '../screens/ListGrupoScreen';
import GrupoSeleccionadoScreen from '../screens/GrupoSeleccionadoScreen';
import SeleccionAlertaScreen from '../screens/SeleccionAlertaScreen';
import ListEventScreen from '../screens/ListEventScreen';
import DetalleEventoEnCursoScreen from '../screens/DetalleEventoEnCursoScreen';
import PerfilUsuarioScreen from '../screens/PerfilUsuarioScreen';
import DetalleGrupoScreen from '../screens/DetalleGrupoScreen';
import ModificarPerfilScreen from '../screens/ModificarPerfilScreen';
import HistorialUsuarioScreen from '../screens/HistorialUsuarioScreen';
import HistorialGrupoScreen from '../screens/HistorialGrupoScreen';
import HeatmapScreen from '../screens/HeatmapScreen';
import DetalleHistorialUsuarioScreen from '../screens/DetalleHistorialUsuarioScreen';
import ListSeguimientosScreen from '../screens/ListSeguimientosScreen';
import DetalleSeguimientoScreen  from '../screens/recibir_seguimiento/DetalleSeguimientoScreen';
import AgregarIntegranteScreen from '../screens/AgregarIntegranteScreen';
import CambiarCodigoSeguridadScreen from '../screens/CambiarCodigoSeguridadScreen';
import HistorialSeguimientosGrupoScreen from '../screens/HistorialSeguimientosGrupoScreen';
import DetalleHistorialSeguimientoScreen from '../screens/DetalleHistorialSeguimientoScreen';
import HistorialSeguimientoPropioScreen from '../screens/HistorialSeguimientoPropioScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  SeleccionAlerta: SeleccionAlertaScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Pedir ayuda',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'fingerprint'
      }
    />
  ),
};

const GruposStack = createStackNavigator({
    Grupos: { screen: ListGrupoScreen },
    GrupoSeleccionado: { screen: GrupoSeleccionadoScreen },
    CrearGrupo: { screen: CrearGrupoScreen},    
    DetalleGrupoSeleccionado: { screen: DetalleGrupoScreen},
    HistorialAlertasGrupo: {screen: HistorialGrupoScreen},
    DetalleHistorialGrupo: {screen: DetalleHistorialUsuarioScreen},
    HistorialSeguimientosGrupo: {screen: HistorialSeguimientosGrupoScreen},
    DetalleHistorialSeguimientoGrupo: {screen: DetalleHistorialSeguimientoScreen},
    AgregarIntegrante: {screen: AgregarIntegranteScreen}
});

GruposStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: 'Grupos',
    tabBarVisible,
    tabBarIcon: ({ focused }) => (
      <GruposIconnWithStylesConnected focused={focused} />
    ),
  }
  
};

const PerfilStack = createStackNavigator({
  Perfil: { screen: PerfilUsuarioScreen },
  ModificarDato: { screen: ModificarPerfilScreen},
  HistorialAlertas: { screen: HistorialUsuarioScreen},
  DetalleHistorialPropio: { screen: DetalleHistorialUsuarioScreen},
  ModificarCodigo: { screen: CambiarCodigoSeguridadScreen },
  HistorialSeguimientos: {screen: HistorialSeguimientoPropioScreen},
  DetalleHistorialSeguimientoPropio: {screen: DetalleHistorialSeguimientoScreen}
})

PerfilStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: 'Perfil',
    tabBarVisible,
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={'account-circle'}
      />
    ),
  }
  
};

const AlertasStack = createStackNavigator({
  Alertas: { screen: ListEventScreen},
  DetalleAlerta: { screen: DetalleEventoEnCursoScreen },
  MapaCalor: {screen: HeatmapScreen}
});

AlertasStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: 'Alertas',
    tabBarVisible,
    tabBarIcon: ({ focused }) => (
      <AlertasIconWithStylesConnected focused={focused} />
    ),
  }
  
};

const SeguimientosStack = createStackNavigator({
  Seguimientos: { screen: ListSeguimientosScreen },
  NuevoSeguimiento: { screen: SolicitudSeguimientoScreen },
  DetalleSeguimiento: { screen: DetalleSeguimientoScreen },
});

SeguimientosStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarLabel: 'Seguimientos',
    tabBarVisible,
    tabBarIcon: ({focused}) => (
      <SeguimientoIconWithStyleConnected focused={focused}/>
    )
  }
  
}

const MapaCalorStack = createStackNavigator({
  //MapaConfig: { screen: HeatmapConfigScreen },
  Mapa: { screen: HeatmapScreen},
});

MapaCalorStack.navigationOptions = {
  tabBarLabel: 'Mapa',
  tabBarIcon: ({ focused }) => (
    <Icon       
      name={'globe-3'}
      style={{ marginBottom: -3 }}
      width={26}
      height={26}
      fill={focused ? Colors.tabIconSelected : Colors.tabIconDefault}      
    />
  ),
}

export default createBottomTabNavigator({
  HomeStack,
  GruposStack,
  AlertasStack,
  SeguimientosStack,
  PerfilStack,
}, {lazy: false});

const SeguimientoIcon = (props) => {
  const {themedStyle} = props;
  props.fetch_seguimientos();

  return (
    <View style={{
      width: 26,
      height: 26
    }}>
      <Icon 
        name="pin-outline"
        style={{ marginBottom: -3}}
        width={26}
        height={26}
        fill={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
      {props.cantidadSeguimientos >= 1 &&<View style={{
        position: 'absolute',
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        backgroundColor: themedStyle.badge.color,
        borderRadius: 8,
        right: -5,
        top: -2
      }}>
        <Text style={{color: themedStyle.text.color}}>{props.cantidadSeguimientos}</Text>
      </View>}
    </View>
  );
}

const SeguimientoIconWithStyle = withStyles(SeguimientoIcon, (theme) => ({
  badge: {
    color: theme['color-danger-500']
  },
  text: {
    color: theme['color-control-default']
  }
}))

const mapStateToPropsSeguimiento = state => {
  return {
    cantidadSeguimientos: Object.keys(state.listaSeguimientos).length
  }
}

const SeguimientoIconWithStyleConnected = connect(mapStateToPropsSeguimiento, {fetch_seguimientos})(SeguimientoIconWithStyle);


const AlertasIcon = (props) => {
  const {themedStyle} = props;
  props.fetchEventos();

  return (
    <View style={{
      width: 26,
      height: 26
    }}>
      <TabBarIcon
        focused={props.focused}
        name={'directions-run'}
      />
      {props.cantidadAlertas >= 1 &&<View style={{
        position: 'absolute',
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        backgroundColor: themedStyle.badge.color,
        borderRadius: 8,
        right: -5,
        top: -2
      }}>
        <Text style={{color: themedStyle.text.color}}>{props.cantidadAlertas}</Text>
      </View>}
    </View>
  );
}

const AlertasIconWithStyles = withStyles(AlertasIcon, (theme) => ({
  badge: {
    color: theme['color-danger-500']
  },
  text: {
    color: theme['color-control-default']
  }
}))

const mapStateToPropsAlerta = state => {
  return {
    cantidadAlertas: Object.keys(state.listaEventos).length
  }
}

const AlertasIconWithStylesConnected = connect(mapStateToPropsAlerta, {fetchEventos})(AlertasIconWithStyles);

const GruposIcon = (props) => {
  const {themedStyle} = props;
  let counter = 0;
  try {
  
  props.grupos.forEach(g => {
    if (g.historialMensajes.length > 0)
      counter += g.historialMensajes[0].nroMensaje - props.mensajesLeidos[g.grupoId];
  })
} catch (error) { console.log(error)};

  return (
    <View style={{
      width: 26,
      height: 26
    }}>
      <TabBarIcon
        focused={props.focused}
        name={Platform.OS === 'ios' ? 'ios-finger-print' : 'group'}
      />
      {counter >= 1 && <View style={{
        position: 'absolute',
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        backgroundColor: themedStyle.badge.color,
        borderRadius: 8,
        right: -5,
        top: -2
      }}>
        <Text style={{color: themedStyle.text.color}}>{counter}</Text>
      </View>}
    </View>
  );
}

const GruposIconWithStyles = withStyles(GruposIcon, (theme) => ({
  badge: {
    color: theme['color-danger-500']
  },
  text: {
    color: theme['color-control-default']
  }
}))

const mapStateToPropsGrupo = state => {
  return {
    grupos: Object.values(state.listaGrupos),
    mensajesLeidos: state.mensajesLeidos,
  }
}

const GruposIconnWithStylesConnected = connect(mapStateToPropsGrupo, {fetchEventos})(GruposIconWithStyles);
