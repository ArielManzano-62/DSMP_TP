import React, { Component } from 'react'
import { Button, Layout, Text, ListItem, List } from '@ui-kitten/components'
import { connect } from 'react-redux'
import { Avatar } from 'react-native-paper'
import _ from 'lodash';

import {add_group_seguimiento, remove_group_seguimiento} from '../../redux/actions'

export class FourthPageWizard extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit = () => {
        if(!_.isEmpty(this.props.gruposSeleccionados)) this.props.onSubmit()
    }

    onPress = (item, estaActivo) => {
        if(!estaActivo) this.props.add_group_seguimiento(item.grupoId)
        else this.props.remove_group_seguimiento(item.grupoId)
    }

    renderItemAccessory = (style, item) => { 
        const grupoSeleccionado = this.props.gruposSeleccionados.filter(grupoId => grupoId == item.grupoId);
        const estaActivo = grupoSeleccionado.length == 1;
        return (
            <Button 
                style={style}
                size="tiny" 
                appearance={estaActivo? 'outline' : 'filled'} 
                status={estaActivo? 'info': 'primary'}  
                onPress={() => this.onPress(item, estaActivo)} 
            >
                {estaActivo? 'Enviado':'Enviar'}
            </Button>
        );
    }

    renderItemIcon = (props, item) => {
        return (
        <Avatar.Image size={props.height * 1.2} source={{uri : item.fotoUrl}} />
    )};

    renderItem = ({ item }) => (
        <ListItem
            title={item.grupoNombre}
            icon={(props) => this.renderItemIcon(props, item)}
            accessory={(props) => this.renderItemAccessory(props, item)}
        />
    );

    render() {
        return (
            <Layout style={{ justifyContent: 'space-between'}}>
                <Text>Seleccionar grupos</Text>
                <List
                    data={this.props.data}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.grupoId}
                    style={this.props.style}
                    ListEmptyComponent={() => <Text category='s2' appearence='hint' style={{marginVertical: 10,textAlign: 'center'}}>No integra grupos</Text>}
                />
                <Layout style={{flex: 1, flexDirection: 'row', marginTop: 15}}>
                    <Button
                        onPress={this.props.onPreviousPage}
                        status="control"
                        style={{flex: 1}}
                    > 
                        Atras 
                    </Button>
                    <Button
                        onPress={this.onSubmit}
                        status="success"
                        style={{flex: 5}}
                    > 
                        Comenzar Seguimiento 
                    </Button>
                </Layout>
                
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    data: Object.values(state.listaGrupos),
    gruposSeleccionados: state.ruta.grupoIds
})

const mapDispatchToProps = {
    add_group_seguimiento,
    remove_group_seguimiento
}

export default connect(mapStateToProps, mapDispatchToProps)(FourthPageWizard)
