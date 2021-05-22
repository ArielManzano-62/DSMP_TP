import React, { Component } from 'react'
import {Keyboard, TouchableWithoutFeedback, Dimensions} from 'react-native';
import _ from 'lodash';
import { Layout, List, ListItem, Text, Input, Icon, withStyles } from '@ui-kitten/components'
import moment from 'moment-with-locales-es6';
import calendarConfig from '../constants/calendarConfig';

const {height, width} = Dimensions.get('window');
class Chat extends Component {

    state = {
        text: '',
        coloresPersonas: {},

    }

    getRandomColor = (id) => {
        const {coloresPersonas} = this.state;
        const arrayColores = Object.values(coloresPersonas);

        var color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
 
        if(arrayColores.length > 0 && arrayColores.includes(color))
          return getRandomColor();
        else
        this.setState({ coloresPersonas: {...this.state.coloresPersonas, [id]: color}});

        return color;
    }

    findColor = (id) => {
        const {coloresPersonas} = this.state;

        if (_.has(coloresPersonas, id)) return coloresPersonas[id];        
        return this.getRandomColor(id)
    }

    sendMessage = () => {
        this.setState({text: ''});  
        this.props.sendMessage(this.state.text);      
    }

    renderMensaje = ({item}) => {
        const {themedStyle} = this.props;

        return (
            <ListItem style={[themedStyle.messageContainer, { backgroundColor: 'transparent' }]} >                
                <Layout style={{flexDirection: 'row', flex: 1, backgroundColor: 'transparent'}}>                    
                        <Text style={{ color: this.findColor(item.usuarioId), paddingRight: 5 }}>{item.mensaje.nombreEmisor}: <Text>{item.mensaje.contenido}</Text></Text>                        
                </Layout>
                <Layout style={{marginHorizontal: '1%',  alignSelf: 'flex-start', backgroundColor: 'transparent'}}>
                    <Text>{moment(item.fechaHoraMensaje).calendar(null, calendarConfig)}</Text>
                </Layout>   
            </ListItem>
        );
    }

    render() {
        const { themedStyle, theme, mensajes, style } = this.props;
        const { text } = this.state;

        return (
            <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
                <Layout style={[themedStyle.chatContainer, style]} >
                    <List
                        inverted={true}
                        style={{flex: 1, backgroundColor: 'transparent', paddingVertical: '3%'}}
                        data={mensajes}
                        showsVerticalScrollIndicator={false}
                        renderItem={this.renderMensaje}
                    />
                    <Layout style={themedStyle.inputContainer}>
                        <Input 
                            style={{width: '90%'}}
                            placeholder='Mensaje...' 
                            onChangeText={t => this.setState({text: t})} 
                            value={text}
                            icon={style => <Icon name='paper-plane' {...style}  tintColor={!text ? theme['text-disabled-color'] : theme['color-primary-default']}/>}
                            onIconPress={this.sendMessage}
                        />                        
                    </Layout>
                </Layout>
            </TouchableWithoutFeedback>
            
        );
    }
}

export default withStyles(Chat, theme =>({
    chatContainer: {
        justifyContent: 'flex-end',
        backgroundColor: theme['background-basic-color-3']
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: '2%',
        paddingVertical: '1%',
    },
    inputContainer: {
        flexDirection: 'row', 
        height: height * 0.10, 
        width: '100%',  
        paddingHorizontal: '2%',
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme['background-basic-color-2']
    },
}))