import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Image} from 'react-native';
import {withStyles} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Componente representativo de una notificación push de una alerta de panico.
const PopUpPanico = ({onPress, notificacion, themedStyle, theme}) => {

    return (        
        <TouchableOpacity onPress={onPress} style={[themedStyle.container]}>
            <View style={themedStyle.containerImage}>
                <Image source={{uri: notificacion.foto}}  style={themedStyle.personalImage}/>
            </View>
            <View style={{ flex: 3, padding: 6, flexDirection: 'column'}}>
                <View style={themedStyle.viewIcon}>                    
                    <Text style={{color: notificacion.color === 'red' ? theme['color-danger-default'] : theme['color-success-default'], marginRight: 5}}>{notificacion.header}</Text>
                    {notificacion.icon && <Icon name={notificacion.icon} size={15} color={notificacion.color === 'red' ? theme['color-danger-default'] : theme['color-success-default']}/>}
                </View>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 4, justifyContent: 'flex-start'}}>
                        <Text style={themedStyle.title}>{notificacion.title}</Text>
                        {notificacion.description && <Text style={themedStyle.description}>{notificacion.description}</Text>} 
                    </View>                    
                    <View style={{flex: 1, padding: 8, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 10}}>{notificacion.hora}</Text>
                    </View>
                </View>
            </View>
            
                      
        </TouchableOpacity>
    );
}



export const PopUp = withStyles(PopUpPanico, theme => ({
    container:{
        backgroundColor: 'white',  width: '100%', justifyContent: 'space-around', 
        elevation: 5, margin: 1, flexDirection: "row", borderRadius: 5
    },
    viewIcon: {
        alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row', paddingTop: 5
    },
    title: {
        color: '#212121', fontSize: 12
    },
    description: {
        color: '#616161', fontSize: 10
    },
    header:{
        color: '#B71C1C', fontSize: 10, padding: 2
    },
    personalImage: {
        width: 50, height: 50, borderRadius: 25,
    },
    containerImage: {
        justifyContent: 'center', alignContent: 'center', marginLeft: '2.5%'
    }
  }));
