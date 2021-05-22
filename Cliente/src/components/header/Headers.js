import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons'

const logo = require('../../assets/images/alce.png')

const Headers = () =>{
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchableOpacity}>
                <Icon name="menu" size={25} color="white" />
            </TouchableOpacity>
            <Image style={{ width: 40, height: 40 }} source={logo} />
            <TouchableOpacity style={styles.touchableOpacity}>
                <Icon name="help-outline" size={25} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default Headers