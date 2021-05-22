import React from 'react';
import { Image, View } from 'react-native';
import {
    TopNavigation,
    TopNavigationAction,
    Icon,
    withStyles
} from '@ui-kitten/components';

import TextStyles from '../../constants/TextStyles';

const ArrowBackFill = (style, color) => {
    return (
        <Icon name='arrow-ios-back' {...style} tintColor={color}/>
    );
}

const MoreVerticalFill = (style, color) => {
    return (
        <Icon name='more-vertical' {...style} tintColor={color}/>
    );
}

class GrupoHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
            selectedIndex: null,
        }
    } 


    _onBack = () => {
        this.props.onBack();
    }

    _onMoreDetails = () => {
        this.props.onMoreDetails();
    }

    renderLeftControl = (color) => {
        return (
          <TopNavigationAction
                icon={(style) => ArrowBackFill(style, color)}
                onPress={this._onBack}            
          />
        );
    };

    renderRightControls = (color) => {
        return (            
            <TopNavigationAction
                icon={(style) => MoreVerticalFill(style, color)}
                onPress={this._onMoreDetails}                
            />            
        );
    }

    render() {
        const { themedStyle } = this.props;
        return (
            <TopNavigation 
                style={themedStyle.container}
                title={this.props.nombreGrupo}
                titleStyle={themedStyle.title}
                alignment='center'
                leftControl={this.renderLeftControl(themedStyle.icon.color)}
                rightControls={this.props.right ? this.renderRightControls(themedStyle.icon.color) : null}

            />
        );
        
    }
}

export default withStyles(GrupoHeader, (theme) => ({
    container: {
        backgroundColor: theme['background-primary-color-1'],
    },
    icon: {
        color: theme['text-control-color'],
    },
    title: {
        color: theme['text-control-color'],
        ...TextStyles.headline,
        fontWeight: 'bold'
    },
}));