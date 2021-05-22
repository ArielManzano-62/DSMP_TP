import React from 'react';
import { Platform, StyleSheet, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Layout, Text, Button, Modal, withStyles, Input } from '@ui-kitten/components';
import { Portal, Dialog, Paragraph, TextInput, Button as RNPButton, HelperText } from 'react-native-paper';

import TextStyle from '../constants/TextStyles';
import Button_Pulse_loader from '../components/Button_Pulse_loader';
import ValidationInput from '../components/common/ValidationInput';
import { SecurityCodeValidator } from '../utils/validators';

import SmartWatch from '../../SmartWatch';

var {height, width} = Dimensions.get('window');

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    
  }

  onPress = () => {
    this.props.navigation.navigate('SeleccionAlerta');
  }


  render() {
    const { themedStyle } = this.props;

    return (
      <Layout style={{flex: 1}}>
        <SmartWatch props={this.props.navigation}/>
        <Layout style={themedStyle.welcomeContainer}>
          <Text
          style={themedStyle.welcomeLabel}
          category='h4'
          numberOfLines={1}>
            Bienvenido, {(this.props.profile['http://closely.com/user_metadata'].given_name) ? this.props.profile['http://closely.com/user_metadata'].given_name : this.props.profile.given_name}
          </Text>
          <Text
          style={themedStyle.nameLabel}
          category='h6'
          numberOfLines={2}>
            Con nosotros siempre te sentiras cuidado.
          </Text>
        </Layout>
        <Layout style={themedStyle.helperTextContainer}>
          <Text
            appearance='hint'
            category='s1'
            style={themedStyle.helperText}
          >
            Para enviar una alerta, presione el botón de pánico
          </Text>
        </Layout>
        <Layout style={themedStyle.buttonContainer}>
          <Button_Pulse_loader  style={themedStyle.button}
          backgroundColor={themedStyle.button.backgroundColor}
          justifyContent='center'
          onPress={this.onPress}
          />          
        </Layout>   
      </Layout>
    );
    
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const pantalla = withStyles(HomeScreen, (theme) => {
    return ({        
      welcomeContainer: {
          flex: 3,
          //flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme['background-primary-color-1']
      },
      buttonContainer: {
          flex: 3,
          justifyContent: 'center',
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
      welcomeLabel: {        
        color: theme['text-control-color'],
        marginBottom: height * 0.02,
        //marginTop: height * 0.05,
        ...TextStyle.headline,
        fontWeight: 'bold'

      },
      nameLabel: {
        color: theme['text-control-color'],
        alignSelf: 'center',
        //marginTop: height * 0.05,
        ...TextStyle.headline,
        textAlign: 'center'
      },
      helperText: {
          color: theme['text-hint-color'],
          ...TextStyle.subtitle,
      },
  });
})

const mapStateToProps = state => {
  return {
    profile: state.profile
  }
}

export default connect(mapStateToProps, {})(pantalla);



/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});*/