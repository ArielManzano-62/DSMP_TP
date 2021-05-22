import React, { Component } from 'react';
import {
  Dimensions, Platform, PixelRatio, View , TouchableOpacity
} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {
  TopNavigation, withStyles, TopNavigationAction, Icon, Text, Layout,
} from '@ui-kitten/components';
import { connect } from 'react-redux'
import polyline from '@mapbox/polyline';

import TextStyles from '../../constants/TextStyles';
import SolicitudSeguimientoWizard from './SolicitudSeguimientoWizard';
import Textstyles from '../../constants/TextStyles';
import {add_waypoint, change_destination, reiniciar_ruta, cargar_ruta, iniciar_seguimiento, change_origin, remove_waypoint} from '../../redux/actions';
import GetLocation from '../../utils/GetLocation'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE= -31.348891;
const LONGITUDE= -64.254058;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyBPkawtBCR4KdLBW-RRI492sRknc0KEt-g';

class SolicitudSeguimientoScreen extends Component {
  constructor(props) {
    super(props);

    this.mapView = null;
    this.state = {
      mapReady: false,
    }
  }

  _onBack = () => { 
    this.setState({mapReady: false})
    this.props.reiniciar_ruta();    
    this.props.navigation.pop();
    
  }

  renderLeftControl = () => {
    const {themedStyle} = this.props;
      return (
          <TopNavigationAction
              icon={(style) => ArrowBackFill({...style, tintColor: themedStyle.icon.color})}
              onPress={this._onBack}
          />
      );
  };

  renderHeader = () => {
    const {themedStyle} = this.props;
    return (
        <TopNavigation
          style={themedStyle.header}
          title='Solicitud de seguimiento'
          titleStyle={themedStyle.headerTitle}
          alignment='center'
          leftControl={this.renderLeftControl()}
        />
    );
  }

  onMapPress = (e) => {
    const {waypoints, page} = this.props.ruta;

    if (page === 2) this.props.change_destination(e.nativeEvent.coordinate)
    if (page === 3) {
      if(waypoints.length > 5) return;
      this.props.add_waypoint(e.nativeEvent.coordinate);
    }

  }

  iniciarSeguimiento = async () => {
    await this.props.iniciar_seguimiento();
    this.props.navigation.navigate('EnSeguimiento');
  }

  updateLocation = location => {
    const {latitude, longitude} = location;
    this.props.change_origin({latitude, longitude});  
    setTimeout(() => this.mapView ? this.mapView.animateCamera({
      center: 
        {
          latitude, 
          longitude
        },
      pitch: 0,
      heading: 0,
      zoom: 16
    }) : '', 1500); 
    
  }

  renderMapDirections({modo, origen, destino, waypoints, isInSeguimiento}){
    console.log('reloading...');
    return(
        <MapViewDirections
          region="AR"
          language="es"
          waypoints={ waypoints }
          origin={origen}
          destination={ destino }
          apikey={GOOGLE_MAPS_APIKEY}
          mode={modo}
          strokeWidth={5}
          strokeColor="blue"
          onReady={result => {
            const encodedPolyline = polyline.encode(result.coordinates.map(e => [e.latitude, e.longitude]));
            this.mapView.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: (width / 20),
                bottom: isInSeguimiento? (height/20): height,
                left: (width / 20),
                top: (height / 5),
              }
            });
            this.props.cargar_ruta(encodedPolyline)
          }}
          onError={error => {
            console.log('asd');
            this.props.cargar_ruta(undefined);
          }}
        />
      )
  }

  render() {
    const { origen, destino, waypoints, isInSeguimiento} = this.props.ruta
    const {theme} = this.props;
    console.log(waypoints);
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent'}}> 
            
        <MapView  
          provider={PROVIDER_GOOGLE}
          onMapReady={() => this.setState({mapReady: true})}          
          ref={c => this.mapView = c}
          style={{flex: 1}}
          onPress={this.onMapPress}
        >

          {!isInSeguimiento && waypoints.map((coordinate, index) =>
            <MapView.Marker key={`waypoint_${index}`} coordinate={coordinate} color={theme['color-warning-500']}>
                <MapView.Callout tooltip onPress={() => this.props.remove_waypoint(coordinate)}>
                  <Layout style={{justifiContent: 'center', alignItems: 'center', padding: 8}}>
                      <Text>Eliminar</Text>
                  </Layout>
                </MapView.Callout>
            </MapView.Marker>
          )}
          {origen && <MapView.Marker key={'origin'} coordinate={origen} />}
          {destino && <MapView.Marker key={'destination'} coordinate={destino} />}

          {(origen && destino && !isInSeguimiento) && this.renderMapDirections(this.props.ruta)}
          {(origen && destino && isInSeguimiento) && this.renderMapDirections(this.props.ruta)}

        </MapView>
        {!origen && this.state.mapReady && <GetLocation updateLocation={this.updateLocation}/>} 
        {this.renderHeader()}
        {!isInSeguimiento && <SolicitudSeguimientoWizard onSubmit={this.iniciarSeguimiento} style={this.props.themedStyle.wizard}/>}
      </View>
    );
  }
}

const ArrowBackFill = (style) => {
  return (
      <Icon name="arrow-ios-back-outline" {...style}/>
  );
}

SolicitudSeguimientoScreen.navigationOptions = { header: null, };

const scale = width / 320;

function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

const screen = withStyles(SolicitudSeguimientoScreen, (theme) => ({
    mapa: {
      position: 'absolute',
      top: height *0.09,
      width: width,
      height: height *0.91
    },
    headerTitle : {
      color: theme['text-control-color'],
      ...TextStyles.headline,
      fontWeight: 'bold'            
  },
    icon: {
      color: theme['text-control-color'],
    },
    header: {
      position: 'absolute',
      alignSelf: 'center',
      width: width ,
      backgroundColor: theme['background-primary-color-1'],
    },
    wizard: { 
      position: 'absolute',
      bottom: 20,
      width: '95%',
      alignSelf: 'center',
      maxHeight: height*0.4,

      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 20,
      backgroundColor: 'white',
      borderColor: '#bdbdbd',
      borderWidth: 2
    }
  }) 
);

const mapStateToProps = state => ({
    ruta: state.ruta
})

export default connect(mapStateToProps, {change_origin, iniciar_seguimiento, add_waypoint, change_destination, reiniciar_ruta, cargar_ruta, remove_waypoint})(screen);
