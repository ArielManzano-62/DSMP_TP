import React, { Component } from 'react'
import { View, Text, Alert, PermissionsAndroid } from 'react-native'
import RNLocation from 'react-native-location';
import { connect } from 'react-redux'

class GetLocation extends Component {

    componentDidMount() {
        this._enableLocation()
    }

    _enableLocation = async () => {        
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted) this._getLocation();
    }

    _getLocation = async () => {
        await RNLocation.configure({
            distanceFilter: 3.0,

            interval: 5000,
            desiredAccuracy: {
                ios: 'best',
                android: 'highAccuracy'
            }
        });

        const granted = await RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
                detail: "fine"
            }
        });

        if (granted) {
            this._startUpdatingLocation()
        }                
            
    }

    _startUpdatingLocation = () => {
        this.locationSubscription = RNLocation.subscribeToLocationUpdates(
            location => {
                this.props.updateLocation(location[0]);
                console.log(location)
            }
        );
    }

    _stopUpdatingLocation = () => {
        this.locationSubscription && this.locationSubscription();
    }

    componentWillUnmount() {
        this._stopUpdatingLocation()
    }

    render() {
        return <View />
    }

}

export default GetLocation;