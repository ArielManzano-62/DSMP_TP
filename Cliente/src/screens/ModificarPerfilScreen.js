import React from 'react';
import {
    TopNavigation,
    TopNavigationAction,
    Button,
    Layout,
    Input,
    Icon,
    withStyles,
} from '@ui-kitten/components';

import { setStateSpinner } from '../redux/actions';
import TextStyles from '../constants/TextStyles';
import { connect } from 'react-redux';

const EditIconOutline = (style) => {
    return (
        <Icon name='edit-outline' {...style}/>
    );
}

const BackArrowIcon = (style, tintColor) => {
    return (
        <Icon name='arrow-ios-back' {...style} tintColor={tintColor} />
    );
}

class ModificarPerfilScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: this.props.navigation.state.params.value,
            guardar: this.props.navigation.state.params.guardar,
            title: this.props.navigation.state.params.title,
        }
    }

    renderHeader = () => {
        const { themedStyle } = this.props;

        const leftAction = 
        <TopNavigationAction 
        icon={(style) => BackArrowIcon(style, themedStyle.action.color)}
        onPress={() => this.props.navigation.pop()}
        />

        return (
            <TopNavigation 
            title={this.state.title}
            alignment='center'
            style={themedStyle.headerContainer}
            titleStyle={themedStyle.headerTitle}
            leftControl={leftAction}
            />
        );
    }

    render() {
        const { themedStyle } = this.props;

        return (
            <Layout style={{flex: 1}}>            
                {this.renderHeader()}                
                <Layout style={themedStyle.container}>                                                       
                    <Input 
                    style={themedStyle.input}
                    value={this.state.input}
                    onChangeText={(value) => this.setState({ input: value })}
                    icon={EditIconOutline}
                    placeholder={this.props.navigation.state.params.value}
                    size='small'
                    autoFocus={true}
                    />
                    <Button
                    style={themedStyle.button}
                    disabled={this.state.input == ''}
                    onPress={async () => {
                        this.props.setStateSpinner(true);
                        await this.state.guardar(this.state.input)
                        .then(() => {
                            this.props.setStateSpinner(false);
                            this.props.navigation.pop();
                        })
                        
                    }}
                    >
                        Guardar
                    </Button>
                </Layout>
            </Layout>
            
        );
    }
}

ModificarPerfilScreen.navigationOptions = {header: null}

const pantalla = withStyles(ModificarPerfilScreen, (theme) => ({
    headerContainer: {
        backgroundColor: theme['background-primary-color-1'],
    },
    headerTitle: {
        color: theme['text-control-color'],
        ...TextStyles.headline,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
        justifyContent: 'space-between',        
    },
    action: {
        color: theme['text-control-color'],
    },
    input: {
        marginTop: 24,
        marginHorizontal: 12
    },
    button: {
        marginBottom: 24,
        marginHorizontal: 12
    }

}));

export default connect(null, {
    setStateSpinner
})(pantalla);