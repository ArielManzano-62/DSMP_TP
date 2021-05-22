import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, NativeModules, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import {Layout, withStyles, Text} from '@ui-kitten/components';

import { enviarNuevoEvento, setStateSpinner, nuevoEvento } from '../redux/actions';
import { INCENDIO, ASALTO, EMERGENCIA_MEDICA} from '../constants/Variables';
import Headers from '../components/header/Headers';
import EmergencyButton from '../components/EmergencyButton';
import TextStyle from '../constants/TextStyles';

var {height, width} = Dimensions.get('window');
const EVENTO_ID = "eventoId";

class SeleccionAlertaScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = { timer: 15 };
    }

    componentDidMount() {
      DeviceEventEmitter.addListener(EVENTO_ID, (id) => this.showIdEvent(id));
        this.interval = setInterval(() => {
            if (this.state.timer > 0) {                
                this.setState(prevState => ({timer: prevState.timer - 1}));
            } else {
                clearInterval(this.interval);
                
                this.props.navigation.pop();
            }
        }, 1000);
    }

    showIdEvent = (eventoId) => {
      
      console.log( eventoId.eventoId == "" ? "El evento id esta vaciooooooooooooooooooo" : "El evento NOOOO ESTA VACIOOOO")
      var event = JSON.parse(eventoId.eventoId)
      console.log(event)
      this.props.nuevoEvento(event)
      this.props.setStateSpinner(false)
      this.props.navigation.navigate('EnEvento');
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        DeviceEventEmitter.removeListener(EVENTO_ID,(id) => this.sendAlert(id));
    }

    /*enviarEvento = (type) => {
        this.props.setStateSpinner(true)
        this.props.enviarNuevoEvento(type)
            .then(() => {
                this.props.setStateSpinner(false)
                if (this.props.success) {
                    this.props.navigation.navigate('EnEvento');
                } else {
                    this.props.navigation.pop();
                }
            })
            .catch((err) => {console.log(err.message), this.props.setStateSpinner(false)});
    }*/

    enviarEvento = (type) => {
      this.props.setStateSpinner(true)
      NativeModules.EventoModule.newEvent(type);
    }

    render() {
        const { themedStyle } = this.props;
    
        return (
          <Layout style={{flex: 1}}>
            <Layout style={themedStyle.welcomeContainer}>
              <Text
              style={themedStyle.welcomeLabel}
              category='h1'
              numberOfLines={1}>
                {this.state.timer}
              </Text>              
            </Layout>
            <Layout style={themedStyle.helperTextContainer}>
              <Text
                appearance='hint'
                category='h6'
                style={themedStyle.helperText}
              >
                Seleccione el tipo de emergencia
              </Text>
            </Layout>
            <Layout style={themedStyle.buttonContainer}>
              <Layout style={themedStyle.emergencyButtonContainer}>
                <EmergencyButton 
                    icon='pistol'
                    size={width * 0.15}
                    backgroundColor={themedStyle.button.backgroundColor}
                    justifyContent='center'
                    onPress={() => this.enviarEvento(ASALTO)}
                />
                <Text
                style={themedStyle.label}
                appearance='hint'
                category='c1'>
                    Asalto
                </Text>
              </Layout>
              <Layout style={themedStyle.emergencyButtonContainer}>
                <EmergencyButton 
                    icon='fire'
                    size={width * 0.15}
                    backgroundColor={themedStyle.button.backgroundColor}                    
                    justifyContent='center'
                    onPress={() => this.enviarEvento(INCENDIO)}
                />
                <Text
                style={themedStyle.label}
                appearance='hint'
                category='c1'>
                    Incendio
                </Text>
              </Layout>
              <Layout style={themedStyle.emergencyButtonContainer}>
                <EmergencyButton 
                    icon='medical-bag'
                    size={width * 0.15}
                    backgroundColor={themedStyle.button.backgroundColor}                    
                    justifyContent='center'
                    onPress={() => this.enviarEvento(EMERGENCIA_MEDICA)}
                />
                <Text
                style={themedStyle.label}
                appearance='hint'
                category='c1'
                numberOfLines={2}>
                    Emergencia Medica
                </Text>
              </Layout>
            </Layout>
            
          </Layout>
        );
        
    }
}

SeleccionAlertaScreen.navigationOptions = {
    header: null,
};

const screen = withStyles(SeleccionAlertaScreen, (theme) => {
    return ({        
      welcomeContainer: {
          flex: 2,
          //flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme['background-primary-color-1']
      },
      buttonContainer: {
          flex: 3,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: width * 0.05,
          paddingVertical: height * 0.02,
          backgroundColor: theme['background-basic-color-2']
      },
      helperTextContainer: {
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: theme['background-basic-color-2'],
          alignSelf: 'stretch', 
          //marginBottom: height * 0.02
      },
      button: {
        backgroundColor: theme['color-danger-600'],
      }, 
      emergencyButtonContainer: {
        flex: 1,
        backgroundColor: theme['background-basic-color-2'],
        justifyContent: 'center',
        alignItems: 'center',
      },     
      welcomeLabel: {        
        color: theme['text-control-color'],
        marginBottom: height * 0.02,
        //marginTop: height * 0.05,
        ...TextStyle.headline,
        fontWeight: 'bold'

      },      
      helperText: {
          color: theme['text-hint-color'],
          ...TextStyle.subtitle,
          //fontWeight: 'bold',
      },
      label: {
        color: theme['text-hint-color'],
        ...TextStyle.caption1,
        marginTop: height * 0.025
      }
  });
})


const mapStateToProps = state => {
    return { 
        success: state.evento.isInEvent,
        spinner: state.spinner.loading
    }
}

export default connect(mapStateToProps, { enviarNuevoEvento, setStateSpinner, nuevoEvento })(screen);