import React, { Component } from 'react'

import { TopNavigation, TopNavigationAction, Layout, Text, Avatar, List, ListItem, Icon, withStyles } from '@ui-kitten/components';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment-with-locales-es6'
import calendarConfig from '../constants/calendarConfig';

import { connect } from 'react-redux'
import { selectEvent, fetchEventos, updateEvent } from '../redux/actions'
import TextStyles from '../constants/TextStyles';

const TriangleIcon = (style, color) => {
    return (
        <Icon name='alert-triangle' {...style} fill={color}/>
    );
}

class ListEventScreen extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await this._fetchData();
    }

    _fetchData = async () => {
        try {
            await this.props.fetchEventos();          
        } catch (err) {
            console.log(err.message);
        }
        
    }

    _onClick = async (eventoId) => {  
        await this.props.updateEvent(eventoId);      
        this.props.selectEvent(eventoId); 
        this.props.navigation.navigate('DetalleAlerta');
        
        
    }

    renderHeader = () => {
        const { themedStyle, theme } = this.props;
        return (
            <TopNavigation 
                style={themedStyle.headerContainer}
                title='Alertas'
                titleStyle={themedStyle.title}
                alignment='center'    
                rightControls={<TopNavigationAction 
                    icon={style => (<Icon name='globe-2-outline' {...style} tintColor={theme['text-control-color']}/>)}
                    onPress={() => this.props.navigation.navigate('MapaCalor')}
                />}                         

            />
        );
    }

    renderIcon = () => {
        const {themedStyle} = this.props

        return TriangleIcon(themedStyle.iconAlert, themedStyle.iconColor.color);
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
        const {id, afectado, tipoEvento, fechaHora} = item;        

        return (
            <ListItem 
                style={[themedStyle.listItem, {padding: 0, overflow: 'hidden'}]}
                title={`${afectado.nombre}`}
                description={tipoEvento}
                titleStyle={[themedStyle.listItemTitle, {flex: 1, top: '10%'}]}
                descriptionStyle={[themedStyle.listItemDescription, {flex: 1,}]}
                icon={(style) => this.renderAvatar(style, afectado.foto)}
                accessory={() => (
                    <Layout style={{alignSelf: 'stretch', backgroundColor: 'transparent'}}>                    
                        <Text category='s2'>{moment(fechaHora).calendar(null, calendarConfig)}</Text>                        
                    </Layout>
                    
                )}
                onPress={() => this._onClick(id)}
            />
        );
    }

    renderEmptyList = () => {
        return (
            <Layout level='2' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {this.renderIcon()}
                <Text category='s1' appearence='hint' style={{textAlign: 'center'}}>
                    No hay alertas en este momento
                </Text>
            </Layout>
        )
        
    }


    render() {    
        const {theme} = this.props;    
        return (
            <Layout style={{flex: 1}}> 
                {this.renderHeader()}               
                <NavigationEvents onDidFocus={() => this._fetchData()} />
                <List
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: theme['background-basic-color-2'] }}
                    data={this.props.eventos}
                    renderItem={this.renderItem}                    
                    keyExtractor={item => item.id}
                    ListEmptyComponent={this.renderEmptyList}
                />                   
            </Layout>
        );
    }
}

ListEventScreen.navigationOptions = { header: null,};

const mapStateToProps = state => {
    return {
        eventos: Object.values(state.listaEventos).sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()),
    }
}

const Screen = withStyles(ListEventScreen, (theme) => {
    return ({
        headerContainer: {
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
        iconAlert : {
            width: 100,
            height: 100
        },
        iconColor: {
            color: theme['color-warning-500']
        },
        listItem: {
            height: 75, 
            backgroundColor: 'transparent', 
            borderBottomWidth: 0.2, 
            borderBottomColor: theme['color-control-focus-border']
        },
        listItemTitle: {            
            fontSize: 16,
        },
        listItemDescription: {
            ...TextStyles.headline,
            fontSize: 14,
        },
        listItemAvatar: {
            width: 52, 
            height: 52, 
            alignSelf: 'center'
        },
    });
})

export default connect(mapStateToProps, { selectEvent, fetchEventos, updateEvent })(Screen)