import React, { Component } from 'react'
import { withStyles, Icon as UIIcon, List, ListItem, TopNavigation, TopNavigationAction,  Text, Layout } from '@ui-kitten/components'
import TextStyles from '../constants/TextStyles'
import axios from 'axios'
import moment from 'moment-with-locales-es6';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { eventosEndpoint } from '../api';
import calendarConfig from '../constants/calendarConfig';

class HistorialUsuario extends Component {
    constructor(props) {
        super(props);
        moment.locale('es');

        this.state = {
            data: []
        }
    }

    _onBack = () => {
        this.props.navigation.pop();
    }

    componentDidMount() {
        this.getHistorialEventos()
    }

    componentWillUnmount() {
        console.log('UNMOUNTING LISTA')
    }

    getImageAndColor = (tipoEvento) => {
        const {theme} = this.props;
        switch (tipoEvento) {
            case "Asalto":
                return {
                    image: 'pistol',
                    color: theme['color-danger-default']
                }
            case "Emergencia Medica":
                return {
                    image: 'medical-bag',
                    color: theme['color-success-default']
                };
            case "Incendio":
                return {
                    image: 'fire',
                    color: theme['color-warning-default']
                };
        }
    }   

    getHistorialEventos = async () => {
        try {
            const response = await axios.get(`${eventosEndpoint}/api/usuarios/historial`)
            response.data.sort((a, b) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime());
            this.setState({data: response.data});
        } catch (error) {
            console.log(error);
        }         
    }

    renderLeftControl = () => {
        const {theme} = this.props;
        return (
          <TopNavigationAction
                icon={(style) => <UIIcon name='arrow-ios-back' {...style} tintColor={theme['text-control-color']}/>}
                onPress={this._onBack}            
          />
        );
    };

    renderHeader = () => {
        const { themedStyle } = this.props;
        return (
            <TopNavigation 
                style={themedStyle.headerContainer}
                title='Historial de Alertas'
                titleStyle={themedStyle.title}
                alignment='center'
                leftControl={this.renderLeftControl()}               

            />
        );
    }

    renderItem =  ({item}) => { 
        const { themedStyle } = this.props;
        const {image, color} = this.getImageAndColor(item.tipoEvento);

        return (
            <ListItem 
                style={[themedStyle.listItem, {padding: 0}]}
                title={`${item.tipoEvento}`}
                titleStyle={themedStyle.listItemTitle}
                icon={(style) => {
                    delete style.tintColor; 
                    return (<Icon name={image} size={24} style={{marginHorizontal: 8}} color={color}/>)
                }}
                accessory={() => (<Text category='s2'>{moment(item.fechaHoraInicio).calendar(null, calendarConfig)}</Text>)}
                onPress={() => {                   
                    this.props.navigation.navigate('DetalleHistorialPropio', {
                        evento: item
                    });
                }}
            />
        );
    }

    renderEmptyList = () => {
        const {theme} = this.props;
        return (
            <Layout level='2' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <UIIcon name="alert-triangle" height={100} width={100} tintColor={theme['color-warning-500']}/>
                <Text category='s1' appearence='hint' style={{textAlign: 'center'}}>
                    Aún no has enviado alertas
                </Text>
            </Layout>
        )        
    }

    renderListHistorial = () => {
        const {theme} = this.props;
        return (
            <List 
                contentContainerStyle={{ flexGrow: 1, backgroundColor: theme['background-basic-color-2'] }}
                data={this.state.data}
                renderItem={this.renderItem}                    
                keyExtractor={item => item.id}
                ListEmptyComponent={this.renderEmptyList}
            />
        );
    }

    render() {
        return (
            <Layout style={{ flex: 1 }}>
                {this.renderHeader()}
                {this.renderListHistorial()}
            </Layout>
        );
    }
}

HistorialUsuario.navigationOptions = {
    header: null,
};

export default withStyles(HistorialUsuario, (theme) => ({
    headerContainer: {
        backgroundColor: theme['background-primary-color-1'],
    },
    title: {
        color: theme['text-control-color'],
        ...TextStyles.headline,
        fontWeight: 'bold'
    },
    listItem: {
        height: 75, 
        backgroundColor: 'transparent', 
        borderBottomWidth: 0.2, 
        borderBottomColor: theme['color-control-focus-border']
    },
    listItemAvatar: {
        width: 52, 
        height: 52, 
        alignSelf: 'center'
    },
    listItemTitle: {            
        fontSize: 16
    },
    listItemDescription: {
        ...TextStyles.headline,
        fontSize: 14
    },
}));