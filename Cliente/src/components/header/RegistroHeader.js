import React from 'react';
import { Image, View } from 'react-native';
import {
    TopNavigation,
    TopNavigationAction,
    withStyles
} from '@ui-kitten/components';

import TextStyles from '../../constants/TextStyles';

const ArrowIosBackFill = (style, color) => {
    return (
        <Image
          style={style}
          source={require('../../assets/images/arrow-ios-back.png')}
          tintColor={color}
        />
      );
}

class RegistroHeader extends React.Component {

    onBack = () => {
        this.props.onBack();
    }

    renderLeftControl = (color) => {
        return (
          <TopNavigationAction
            icon={(style) => ArrowIosBackFill(style, color)}
            onPress={this.onBack}
            
          />
        );
    };

    render() {
        const {themedStyle} = this.props;
        return (
                <TopNavigation 
                    style={themedStyle.container}
                    title='Registro'
                    titleStyle={themedStyle.title}
                    alignment='center'
                    leftControl={this.renderLeftControl(themedStyle.icon.color)}                               
                />
                
        );
        
    }
}

export default withStyles(RegistroHeader, (theme) => ({
    container: {
        backgroundColor: theme['background-primary-color-1'],
    },
    title: {        
        color: theme['text-control-color'],
        ...TextStyles.headline,
        fontWeight: 'bold'
    },
    icon: {
        color: theme['text-control-color'],
    }
}))