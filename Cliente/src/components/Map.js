import React from 'react'
import { StyleSheet, Image, Text } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';

/*Esta clase recibe por parametros:
    - initialRegion: Region inicial
    - style: Style
    - ubicacionAmigo: posicion gps de la persona (latitud, longitud)
    - ubicacionUsuario: posicion gps del usuario (latitud, longitud)
    - imgAmigo: imagen de la persona que se encuentra en alerta
    - imgUsuario: imagen del usuario
    - zonas: [] de zonas peligrosas
*/

const camaraInicial = {
    center: {
        longitude: -64.269660,
        latitude: -31.349530
    },
    altitude: 1,
    zoom: 1,
    pitch: 1,
    heading: 1
}

class Map extends React.Component {
    //if(!props.initialRegion && !props.ubicacionAmigo) return (<Text>Map sin datos por props...</Text>)
    constructor(props) {
        super(props)

        this.mapView;
    }

    componentDidMount() {
        setTimeout(() => {
            if (!this.props.ubicacionAmigo) return;
            this.mapView.animateCamera(
                {
                    center: {
                        latitude: this.props.ubicacionAmigo.latitude,
                        longitude: this.props.ubicacionAmigo.longitude
                    },
                    altitude: 16,
                    zoom: 16,
                    pitch: 1,
                    heading: 1
                }
            )
        }, 2000);        
        
    }

    onUpdateLocation = (cameraCenter) => {
        if(cameraCenter == null){
            console.log("CameraCenter es null");
            return;
        }
        this.mapView.animateCamera({
            center: cameraCenter,
            altitude: 16,
            zoom: 16,
            pitch: 1,
            heading: 1           

        }, 3000)
    }

    render() {
        return  (
            <MapView provider={PROVIDER_GOOGLE} style={this.props.style}
            ref={map => this.mapView = map}>
                {renderMarker(this.props.ubicacionUsuario, this.props.imgUsuario)}
                {renderMarker(this.props.ubicacionAmigo, this.props.imgAmigo)}
                {renderCriticalZones(this.props.criticalZones)}
            </MapView>
        )
    }
    
}

const renderMarker = (ubicacion, imagen) => {
    if(!ubicacion || !imagen) return
    return(
        <MapView.Marker coordinate={ubicacion} />
    );
}

const renderCriticalZones = (zonas) => {
    if( !zonas || zonas.size <= 0 ) return <Text> </Text>
    return(
        zonas.map((zona, index)=>{
            return(
                <Circle 
                    key={index}
                    center={zona.coordinate} 
                    radius={1000} 
                    fillColor={'rgba(255,0,0,0.3)'} 
                    strokeColor={'rgba(255,0,0,0.3)'}/>
            );
        })
    );
}

const styles = StyleSheet.create({
    marker: {
        width: 60,
        height: 60,
        borderRadius: 360,
        backgroundColor: "rgba(130,4,150, 0.9)",
        borderColor:'green',
        borderWidth: 1
      },
})
export default Map