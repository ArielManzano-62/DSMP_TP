import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction, Icon, Text, List, ListItem, Avatar, withStyles} from '@ui-kitten/components';
import { connect } from 'react-redux';
import Geocoder from 'react-native-geocoding'
import moment from 'moment-with-locales-es6';
import {NavigationEvents} from 'react-navigation';

import { fetch_seguimientos, seleccionar_seguimiento, fetch_seguimiento } from '../redux/actions';
import TextStyles from '../constants/TextStyles';
import calendarConfig from '../constants/calendarConfig';

class ListSeguimientosScreen extends React.Component {
    constructor(props) {
        super(props);
        moment.locale('es');
    }

    componentDidMount = async () => {
        await this.props.fetch_seguimientos();
    }

    newSeguimientoAction = () => {
        const {theme} = this.props;
        return (
            <TopNavigationAction 
                icon={style => <Icon name="plus-outline" {...style} tintColor={theme['text-control-color']} />} 
                onPress={() => this.props.navigation.push('NuevoSeguimiento')}
            />
        )
        
    }

    renderHeader = () => {           
        const {themedStyle} = this.props;

        return (
            <TopNavigation 
                style={themedStyle.header}
                title="Seguimientos"
                titleStyle={themedStyle.headerTitle}
                alignment="center"
                rightControls={this.newSeguimientoAction()}
            />
        )
    }

    renderEmptyList = () => {
        const {themedStyle, theme} = this.props;

        return (
            <Layout level='2' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='pin' style={themedStyle.iconAlert} tintColor={theme['color-warning-500']}/>
                <Text category='s1' appearence='hint' style={{textAlign: 'center'}}>
                    No hay seguimientos en este momento
                </Text>
            </Layout>
        );
    }

    renderAvatar = (style, src) => {
        delete style.tintColor;
        const {themedStyle} = this.props;
        return (                
            <Avatar shape='round' 
                source={{uri: src}} 
                style={[style, themedStyle.listItemAvatar]} />
        );    

    }

    renderItem =  ({item}) => { 
        const { themedStyle, theme } = this.props;

        return (
            <ListItem 
                style={[themedStyle.listItem, {padding: 0}]}
                title={`${item.usuario.nombre} ${item.usuario.apellido}`}
                description={item.estado}
                titleStyle={themedStyle.listItemTitle}
                descriptionStyle={[themedStyle.listItemDescription, item.estado === 'En Curso' ? {color: theme['color-success-500']} : {color: theme['color-danger-500']}]}
                icon={(style) => this.renderAvatar(style, item.usuario.fotoUrl)}
                accessory={() => (<Text category='s2'>{moment(item.fechaHoraInicio).calendar(null, calendarConfig)}</Text>)}
                onPress={() => {
                    this.props.fetch_seguimiento(item.id);
                    this.props.seleccionar_seguimiento(item.id);
                    this.props.navigation.navigate('DetalleSeguimiento');
                }}
            />
        );
    }

    render() {
        const {themedStyle, theme} = this.props
        return (
            <Layout style={themedStyle.container}>
                {this.renderHeader()}
                <NavigationEvents onDidFocus={() => this.props.fetch_seguimientos()} />
                <Layout style={{flex: 1}}>
                    <List
                        contentContainerStyle={{ flexGrow: 1, backgroundColor: theme['background-basic-color-2'] }}
                        data={this.props.seguimientos}
                        renderItem={this.renderItem}                    
                        keyExtractor={item => item.id}
                        ListEmptyComponent={this.renderEmptyList}
                    />
                </Layout>
            </Layout>
            
            
        )
    }
}

ListSeguimientosScreen.navigationOptions = {
    header: null
}

const pantalla = withStyles(ListSeguimientosScreen, theme => {
    return ({
        header: {
            backgroundColor: theme['background-primary-color-1'],
        },
        headerTitle : {
            color: theme['text-control-color'],
            ...TextStyles.headline,
            fontWeight: 'bold'            
        },
        container: {
            flex: 1,
        },
        iconAlert : {
            width: 100,
            height: 100
        },
        listItem: {
            height: 75, 
            backgroundColor: 'transparent', 
            borderBottomWidth: 0.2, 
            borderBottomColor: theme['color-control-focus-border']
        },
        listItemTitle: {            
            fontSize: 16
        },
        listItemDescription: {
            ...TextStyles.headline,
            fontSize: 14
        },
        listItemAvatar: {
            width: 52, 
            height: 52, 
            alignSelf: 'center'
        },
    })
})

const mapStateToProps = state => {
    return {
        seguimientos: Object.values(state.listaSeguimientos)
    }
}

export default connect(mapStateToProps, { fetch_seguimientos, seleccionar_seguimiento, fetch_seguimiento })(pantalla);