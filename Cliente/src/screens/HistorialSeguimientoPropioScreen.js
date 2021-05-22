import React, { Component } from 'react'
import { withStyles, List, ListItem, TopNavigation, TopNavigationAction, Text, Icon, Layout} from '@ui-kitten/components'
import TextStyles from '../constants/TextStyles'
import axios from 'axios'
import moment from 'moment-with-locales-es6';

import calendarConfig from '../constants/calendarConfig';
import {eventosEndpoint} from '../api';


class HistorialSeguimientosGrupo extends Component {
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
        this.getHistorialSeguimientos()
    }

    getHistorialSeguimientos = async () => {
        try {
            const response = await axios.get(`${eventosEndpoint}/api/seguimientos/historial`);
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
                icon={(style) => <Icon name='arrow-ios-back' {...style} tintColor={theme['text-control-color']}/>}
                onPress={this._onBack}            
          />
        );
    };

    renderHeader = () => {
        const { themedStyle } = this.props;
        return (
            <TopNavigation 
                style={themedStyle.headerContainer}
                title='Historial de Seguimientos'
                titleStyle={themedStyle.title}
                alignment='center'
                leftControl={this.renderLeftControl()}               

            />
        );
    }

    renderItem = ({item}) => { 
        const { themedStyle, theme } = this.props;
        return (
            <ListItem 
                style={[themedStyle.listItem, {padding: 0}]}
                title={`${item.usuario.nombre} ${item.usuario.apellido}`}
                description={item.ruta.direccionDestino}
                titleStyle={themedStyle.listItemTitle}
                descriptionStyle={[themedStyle.listItemDescription]}
                icon={(style) => (<Icon name='pin' {...style} tintColor={theme['color-warning-default']}/>)}
                accessory={() => (<Text category='s2'>{moment(item.fechaHoraInicio).calendar(null, calendarConfig)}</Text>)}
                onPress={() => {
                    this.props.navigation.navigate("DetalleHistorialSeguimientoPropio", {
                        seguimiento: item
                    })
                }}
                
            />
        );
    }

    renderEmptyList = () => {
        const {theme} = this.props;
        return (
            <Layout level='2' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="pin" height={100} width={100} tintColor={theme['color-warning-500']}/>
                <Text category='s1' appearence='hint' style={{textAlign: 'center'}}>
                    Usted aún no ha solicitado seguimientos
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

HistorialSeguimientosGrupo.navigationOptions = {
    header: null,
};

export default Screen = withStyles(HistorialSeguimientosGrupo, (theme) => ({
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
