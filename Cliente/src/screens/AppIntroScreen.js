import React from 'react';
import {View, Image, Text, StyleSheet, StatusBar} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider';
import SplashScreen from 'react-native-splash-screen';

const slides = [
  {
    key: '1',
    title: 'Bienvenido a Closely',
    text: 'La mejor plataforma digital \npara sentirse seguro',
    image: require('../assets/images/alceLogin.png'),
    backgroundColor: '#2895EF',
  },
  {
    key: '2',
    title: 'Creá grupos',
    text: 'Agregá a tus personas de confianza\n a grupos para comenzar a cuidarse entre ustedes',
    image: require('../assets/images/grupos.png'),
    backgroundColor: '#649007',
  },
  {
    key: '3',
    title: 'Enviá alertas',
    text: 'Cuando necesites ayuda, enviá alertas\n para notificar a tus grupos que estas en peligro',
    image: require('../assets/images/alertas.png'),
    backgroundColor: '#1F79B3',
  },
  {
    key: '4',
    title: 'Iniciá seguimientos virtuales',
    text: 'Utiliza los seguimientos virtuales \npara cuando necesites trasladarte entre distintos lugares',
    image: require('../assets/images/seguimientos.png'),
    backgroundColor: '#22bcb5',
    
  },
  {
    key: '5',
    title: 'Smartwatch',
    text: 'Si posee un smartwatch, no dude en \nbajarse la aplicacion \"Closely Smartwatch\" para una mayor agilidad al enviar alertas',
    image: require('../assets/images/smartwatch-pngrepo-com.png'),
    backgroundColor: '#febe29',
    
  },
  {
    key: '6',
    title: '¡Listo!',
    text: 'Ya conoce lo necesario para hacer uso de Closely',
    image: require('../assets/images/finishpng.png'),
    backgroundColor: '#2895EF',
  }
];

const styles = StyleSheet.create({
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'blue',
      padding: 10
    },
    image: {
      width: 300,
      height: 300,
      marginBottom: 16,
      //backgroundColor: 'transparent',
      //resizeMode: 'contain'
    },
    text: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 18,
      textAlign: 'center',
    },
    title: {
      fontSize: 26,
      color: 'white',
      marginBottom: '4%',
      //fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default class AppIntroScreen extends React.Component {

    componentDidMount() {
        StatusBar.setHidden(true)
        SplashScreen.hide();
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
    }

  _renderItem = ({ item }) => {
    return (
        <View
          style={[
            styles.slide,
            {
              backgroundColor: item.backgroundColor,
            },
          ]}>
          
          <Image source={item.image} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      );
  }
  _onDone = () => {
    console.log("done")
    this.props.navigation.navigate('SignedIn')
  }
  
  render() {
    return (
        <AppIntroSlider 
            renderItem={this._renderItem} 
            data={slides} 
            onDone={this._onDone} 
            doneLabel="Iniciar" 
            skipLabel="Omitir" 
            nextLabel="Siguiente"
            prevLabel="Atrás"
            showSkipButton={true}
            showPrevButton={true}/>
    )
  }
}