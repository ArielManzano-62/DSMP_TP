import React from 'react';
import {
    TopNavigation,
    withStyles
} from '@ui-kitten/components';

import TextStyles from '../../constants/TextStyles';

class ProfileHeader extends React.Component {

    render() {
        const {themedStyle} = this.props;

        return (
            <TopNavigation 
            style={themedStyle.container}
            title='Perfil'
            titleStyle={themedStyle.title}
            alignment='center'
            />
        );
    }
}

export default withStyles(ProfileHeader, (theme) => ({
    container: {
        backgroundColor: theme['background-primary-color-1'],
    },
    title: {
        color: theme['text-control-color'],
        ...TextStyles.headline,
        fontWeight: 'bold'
    },
}))