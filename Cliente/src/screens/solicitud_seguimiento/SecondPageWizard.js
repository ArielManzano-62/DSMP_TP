import React from 'react'
import {
    Layout, Input, Button, ButtonGroup, Icon
  } from '@ui-kitten/components';
import { connect } from 'react-redux'
import Geocoder from 'react-native-geocoding'

import { change_destination, cargar_direccion_destino } from '../../redux/actions'

const GOOGLE_MAPS_APIKEY = 'AIzaSyBPkawtBCR4KdLBW-RRI492sRknc0KEt-g';

export const SecondPageWizard = (props) => {
    const [value, setValue] = React.useState('');
    const [validation, setValidation] = React.useState(true);
    const [caption, setCaption] = React.useState('');

    const buscarCoordenadas = async() => {
        if (!(value && value.length > 0)) {
            setValidation(false);
            setCaption('Ingrese un destino');
            return;
        }
        await Geocoder.init(GOOGLE_MAPS_APIKEY, {language : "es"});
        await Geocoder.from(value)
            .then(json => {
                var location = json.results[0].geometry.location;
                props.change_destination({latitude: location.lat, longitude: location.lng});                
            })
            .catch(error => {
                setCaption('Destino desconocido');
                setValidation(false)
            });
    }

    const buscarDireccion = async(lat, lng) => {
        await Geocoder.init(GOOGLE_MAPS_APIKEY, {language : "es"});
        await Geocoder.from(lat, lng)
		.then(json => {
            var addressComponent = json.results[0].address_components;
            var address = {}
            addressComponent.map( ac => {
                var type = ac.types.find(t => t === 'street_number' || t === 'route' || t === 'locality');
                if(type) address[type] = ac.short_name;
            })

            const direccionDestino = `${address.route} ${address.street_number}`;
            if(address.route && address.street_number){
                setValue(direccionDestino)
                props.cargar_direccion_destino(direccionDestino);
            } else {
                props.cargar_direccion_destino(value);
            }
            
            
		})
		.catch(error => console.warn(error));
    }

    React.useEffect(() => {
        if(props.ruta && props.destination){
            setValidation(props.destination)
            buscarDireccion(props.destination.latitude, props.destination.longitude);
        } else {
            setValidation(false);
            setCaption('No se ha encontrado ruta');
        }
    }, [props.ruta]);
    

    React.useEffect(() => {
        setValidation(value && value.length > 0)
        if(!validation) setCaption('Campo vacío')
    }, [value]);

    const primeraVez = true
    React.useEffect(() => {
        setValidation(true)
    }, [primeraVez]);

    const onSubmit = () => {
        if (value && props.destination && props.ruta) props.onSubmit();
        else {
            setValidation(false);
            setCaption('Ingrese un destino');
        }
    }

    return (
        <Layout style={{ flex:1 }}>
            <Layout style={{flex:1, flexDirection:"row"}}>
                <Input
                    size='small'
                    status={validation ? 'basic' : 'danger'}
                    caption={validation ? '' : caption}
                    style={{flex: 9}}
                    label='Destino'
                    placeholder='Ingrese un destino'
                    value={value}
                    onChangeText={(text) => setValue(text) }
                />
                <Button 
                    onPress={buscarCoordenadas} 
                    style={{flex: 1}}
                    status='control'
                    size='large'
                    icon={(style) => <Icon name="search-outline" {...style}/>}/>
            </Layout>
            
            <ButtonGroup status='control' style={{justifyContent: 'flex-end'}}>
                <Button 
                    status='control'
                    size='small'
                    onPress={props.onPreviousPage}
                >
                    Atras
                </Button>
                <Button
                    status='control'
                    size='small'
                    onPress={ onSubmit }
                >
                    Siguiente
                </Button>
            </ButtonGroup>
        </Layout>
    )
    
}

const mapStateToProps = (state) => ({
    destination: state.ruta.destino,
    ruta: state.ruta.ruta
})

const mapDispatchToProps = {
    change_destination,
    cargar_direccion_destino
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondPageWizard)
