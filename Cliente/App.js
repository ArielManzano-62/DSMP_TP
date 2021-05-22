import React, { useRef, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';

import AppNavigator from './src/navigation/AppNavigator';
import NotificacionPush from './src/components/notificacion/NotificacionPush'

import { connect } from 'react-redux';
import { setStateSpinner } from './src/redux/actions';

const App = (props) => {
  const navigator = useRef(null);

  const onPressNotificacion = (params)=> {    
    navigator.current.dispatch(NavigationActions.navigate(params));
  }

  const renderSpinner = () => {
    if(!props.spinner) return
    return(
      <View style={{width:'100%', height:'100%', position:'absolute', justifyContent:'center', alignItems:'center' ,backgroundColor:'rgba(0,0,0,0.5)'}}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{color:'#fff'}}>loading...</Text>
      </View>
    )
  }
  
  return (
    <View style={{flex: 1, backgroundColor: '#fff',}}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <AppNavigator ref={navigator}/>
      <NotificacionPush onPress={onPressNotificacion}/>
      {renderSpinner()}
    </View>
  )
}

const mapStateToProps = state => {
  return { spinner: state.spinner.loading };
}

export default connect( mapStateToProps, { setStateSpinner } )( App );
