import React, { Component } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class EmergencyButton extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      value: new Animated.Value(0),
      opacity: 1
    }    
  }
  
  

  componentDidMount () {
    this.animate()
  }

  animate = () => {
    Animated.loop(
      Animated.timing(
        this.state.value, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true
        }
      )
    ).start();
  }

  render() {
    return (
      <View style={[styles.container, {justifyContent: this.props.justifyContent}]}>
        <Animated.View 
          style={
            {
              position: 'absolute',
              borderColor: this.props.backgroundColor,
              height: this.props.size,
              width: this.props.size,
              borderRadius: this.props.size / 2,
              backgroundColor: 'transparent',
              opacity: this.state.value.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              }),
              borderWidth: 1,
              transform: [
                {
                  scaleX: this.state.value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5]
                  })
                },
                {
                  scaleY: this.state.value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5]
                  })
                }
              ]
            }
          }
        />       
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={[styles.buttonContainer, 
            {backgroundColor: this.props.backgroundColor,
            height: this.props.size,
            width: this.props.size,
            borderRadius: this.props.size / 2}]}>
            <Icon 
            name={this.props.icon} 
            size={this.props.size * 0.7} 
            color="white" 
            style={{borderRadius: this.props.size/14 , borderColor: this.props.backgroundColor}}>
            </Icon>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


EmergencyButton.defaultProps = {
  justifyContent: 'center',
  icon: 'pistol',
  size: 100
}



const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent:'center',
    alignItems:'center',
    borderColor: 'white',
    borderWidth: 1.5,
  },
});