import React, { Component } from "react";
import {Animated} from 'react-native';

/*
Clase que representa una animacion de opacidad a sus hijos. Dura 7 segundos.
La animacion consiste en pasar de opacidad 0 a 1 en 1 segundo, luego permanecer 5 segundos
en opacidad 1 y finalmente pasar de 1 a 0 en el ultimo segundo.
*/
export default class Animacion extends Component {
    state = { animatedValue: new Animated.Value(0)};
    render(){
        const opacityTraslate = this.getTranslate([0, 1])
        return(
            <Animated.View style={[{
                width: '100%',
                padding:5,
                opacity: opacityTraslate,
            }]
            }> 
                {this.props.children}
            </Animated.View>
        );
    }
    componentDidMount() {
        Animated.timing(this.state.animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }).start(()=> {
            Animated.timing(this.state.animatedValue, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: true
              }).start(()=> {
                Animated.timing(this.state.animatedValue, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                  }).start(()=> this.props.eliminarPop())
              })
          }) ;
      }
    getTranslate = outputRange => {
        return this.state.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange
        });
    };
}