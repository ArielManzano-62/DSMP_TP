import React, { Component } from 'react';
import {
  NativeModules,
  DeviceEventEmitter,
  View,
  StyleSheet
} from 'react-native';

import { connect } from 'react-redux';
import { INCENDIO, ASALTO, EMERGENCIA_MEDICA} from './src/constants/Variables';
import { nuevoEvento, setStateSpinner } from './src/redux/actions';


const INCREASE_COUNTER_EVENT = 'increaseCounter';

class reactNativeAndroidWearDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  };

  componentDidMount() {
    DeviceEventEmitter.addListener(INCREASE_COUNTER_EVENT,(evento) => this.sendAlert(evento));
  };

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(INCREASE_COUNTER_EVENT, evento => this.sendAlert(evento));
  };

  sendAlert = (evento) => { 
    console.log("smartwatch.js ---> si falla algo aca nomas, el cast esta fallando")
    console.log(evento.eventoId)
    var event = JSON.parse(evento.eventoId)
    this.props.nuevoEvento(event)
    
    this.props.props.navigate('EnEvento'); 
  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  };
}

const mapStateToProps = state => {
  return { 
      success: state.evento.isInEvent,
      spinner: state.spinner.loading
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});

export default connect(mapStateToProps, { nuevoEvento, setStateSpinner })(reactNativeAndroidWearDemo);
