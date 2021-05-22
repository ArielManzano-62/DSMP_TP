import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'

import { withStyles, List, Avatar, ListItem, Text, Layout } from '@ui-kitten/components'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TextStyles from '../constants/TextStyles'

const { height, width } = Dimensions.get('window');
const itemWidth = width - 50 * 2

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
        overflow: 'hidden',
        elevation: 2
    },
    description: {
        marginTop: 4,
        ...TextStyles.subtitle,
    },
    detailsContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 2,
        paddingVertical: 12,
        flex: 3,
    },
    image: {
        flex: 1,
        height: 30,
        resizeMode: 'contain',
    },
})

const renderImagen = (info) => {
    if (info.imagen == undefined || info.imagen == null) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name='camera-off' size={30} style={{ alignSelf: 'center' }} />
            </Layout>
        );
    }
    if (info.imagen.uri) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>                
                <Avatar source={info.imagen} />
            </Layout>
        );
    }
    else {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={info.imagen} size={30} style={{alignSelf: 'center'}} />
            </Layout>
            
        );
    }
}

const renderHora = (info) => {
    if (info == undefined) return
    if (info.hora == undefined || info.hora == '') return
    return (
        <Text
            appearance='hint'
            category='p2'
            style={[
                TextStyles.paragraph,
                { alignSelf: 'center', alignContent: 'center', justifyContent: 'center', fontSize: 10 }
            ]}
        >
            {info.hora}
        </Text>
    );
}

const renderItem = (info, onPress) => {
    return (
        <ListItem
            onPress={() => onPress(info)}
            style={[styles.container, { marginHorizontal: 1 }]}>
            <Layout style={{flex: 1}}>
                {renderImagen(info)}
            </Layout>
            
            <Layout style={[styles.detailsContainer]}>
                <Text
                    style={TextStyles.caption1}
                    category='s1'
                    numberOfLines={1}>
                    {info.titulo}
                </Text>
                <Text
                    appearance='hint'
                    style={[TextStyles.paragraph, { fontSize: 10 }]}
                    category='p2'
                    numberOfLines={1}>
                    {info.subtitulo}
                </Text>
            </Layout>
            <Layout style={{flex: 1}}>
                {renderHora(info)}
            </Layout>
            
        </ListItem>

    );
}

export const Lista = ({data, onPress}) => {
    console.log('-.-.-.-.-.-.-.-.-.-.-.')
    console.log(data)
    return (
        <Layout style={{ backgroundColor: 'blue', flex: 1 }}>
            <List
                data={data}
                renderItem={({ item }) => renderItem(item, onPress)}
            ></List>
        </Layout>
    );
}