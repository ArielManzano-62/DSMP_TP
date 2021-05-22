import React from 'react';
import { Layout, Button, ButtonGroup, withStyles, Text } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import { change_mode } from '../../redux/actions'

class FirstPageWizard extends React.Component {
    carIcon = (style) => {
        delete style.tintColor;
        return (
            <Icon name="car" size={style.height} color={this.props.selected === 'DRIVING'? '#2196f3' : '#222B45'}/>
        );
    }
    
    walkingIcon = (style) => {
        delete style.tintColor;
        return (
            <Icon name="walk" size={style.height} color={this.props.selected === 'WALKING'? '#2196f3' : '#222B45'}/>
        );
    }

    onSubmit = () => {
        this.props.onSubmit();
    }

    render(){
        const { themedStyle } = this.props;
        return (
            <Layout style={themedStyle.container}>
                <Layout style={themedStyle.layoutButtons}>
                <Text category='h6' >¿Como vas a viajar?</Text>
                    <ButtonGroup status='control' >
                        <Button 
                            icon={this.carIcon} 
                            size='large' 
                            onPress={() => this.props.change_mode('DRIVING')}
                        />
                        <Button 
                            icon={this.walkingIcon} 
                            size='large'
                            onPress={() => this.props.change_mode('WALKING')}
                        />  
                    </ButtonGroup>
                </Layout>
                <Button 
                    status='control'
                    size='medium'
                    style={{width: '40%'}}
                    onPress={this.onSubmit}
                >
                    Siguiente
                </Button>
            </Layout>
        );
    }
}

const screen = withStyles(FirstPageWizard, (theme) => ({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'flex-end',
    },
    layoutButtons: {
        flex: 1,
        width: '100%',
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
      },
      icon: {
        color: '#424242',
      },
}));

const mapStateToProps = state => {
    return {
        selected: state.ruta.modo
    }
}

export default connect(mapStateToProps, {change_mode})(screen);