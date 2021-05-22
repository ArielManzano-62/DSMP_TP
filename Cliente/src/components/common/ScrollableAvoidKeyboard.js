import React from 'react';
import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import {
    withStyles
} from '@ui-kitten/components';

class ScrollableAvoidKeyboard extends React.Component {

    render() {
        const { style, contentContainerStyle, themedStyle, ...restProps } = this.props;

        return (
        <KeyboardAwareScrollView
            bounces={false}
            bouncesZoom={false}
            alwaysBounceVertical={false}
            alwaysBounceHorizontal={false}
            style={[themedStyle.container, style]}
            contentContainerStyle={[themedStyle.contentContainer, contentContainerStyle]}
            enableOnAndroid={true}
            {...restProps}
        />
        );
    }
}

export default withStyles(ScrollableAvoidKeyboard, (theme) => ({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
}))