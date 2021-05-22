import React, {useState, useEffect} from 'react';
import { PermissionsAndroid } from 'react-native';
import {
    Layout,
    Text,
    Button,
    Toggle,
    CheckBox,
    withStyles,
} from '@ui-kitten/components';
import { connect } from 'react-redux';

import TextStyle from '../constants/TextStyles';

const ConfigurarPermisosScreen = (props) => {
    const [locationGranted, setLocationGranted] = useState(false);
    const [cameraGranted, setCameraGranted] = useState(false);
    const [audioGranted, setAudioGranted] = useState(false);

    useEffect(() => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(granted => setLocationGranted(granted));
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(granted => setCameraGranted(granted));
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(granted => setAudioGranted(granted));
    })


    const {themedStyle, theme, profile} = props;

    return (
        <Layout style={{flex: 1}}>
            <Layout style={{flex: 2, alignItems: 'center', backgroundColor: theme['background-primary-color-1']}}>
                <Layout style={{flex: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                    <Text
                        style={[themedStyle.welcomeLabel, {fontWeight: 'bold'}]}
                        category='h4'>
                        Bienvenido, {(profile['http://closely.com/user_metadata'].given_name) ? profile['http://closely.com/user_metadata'].given_name : profile.given_name}
                    </Text>
                </Layout>
                <Layout style={{flex: 6, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'transparent'}}>
                    <Text
                        style={[themedStyle.welcomeLabel, {textAlign: 'center'}]}
                        category='h5'>
                        Para poder brindarle la mejor experiencia posible, necesitamos acceder a ciertos permisos de su dispositivo
                    </Text>
                </Layout>                
            </Layout>
            <Layout style={{flex: 4, backgroundColor: theme['background-basic-color-2']}}>
                <Layout style={{height: '15%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
                    <Text 
                        style={TextStyle.subtitle}
                        appearance="hint"
                        category='s1'
                    >
                        Por favor, habilite los siguientes permisos
                    </Text>
                </Layout>
                <Layout style={{height: '55%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'space-around'}}>
                    <Layout style={{width: '40%', flexDirection: 'row', backgroundColor: 'transparent'}}>
                        <Layout style={{flexGrow: 1, alignSelf: 'center', alignItems:'center', backgroundColor: 'transparent'}}>
                            <Text 
                                style={[TextStyle.caption2]}
                                category='h6'
                            >
                                Ubicación
                            </Text>
                        </Layout>
                        <Layout style={{flexGrow: 1, alignItems:'flex-end', backgroundColor: 'transparent'}}>
                            <CheckBox 
                                checked={locationGranted}
                                status={locationGranted ? 'success': 'primary'}
                                onChange={() => {
                                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(granted => setLocationGranted(granted));
                                }}
                            />
                        </Layout>
                        
                    </Layout>
                    <Layout style={{width: '40%', flexDirection: 'row', backgroundColor: 'transparent'}}>
                        <Layout style={{flexGrow: 1, alignSelf: 'center', alignItems:'center', backgroundColor: 'transparent'}}>
                            <Text 
                                style={[TextStyle.caption2]}
                                category='h6'
                            >
                                Cámara
                            </Text>
                        </Layout>
                        <Layout style={{flexGrow: 1, alignItems:'flex-end', backgroundColor: 'transparent'}}>
                            <CheckBox 
                                checked={cameraGranted}
                                status={cameraGranted ? 'success': 'primary'}
                                onChange={() => {
                                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(granted => setCameraGranted(granted));
                                }}
                            />
                        </Layout>
                        
                    </Layout>
                    <Layout style={{width: '40%', flexDirection: 'row', backgroundColor: 'transparent'}}>
                        <Layout style={{flexGrow: 1, alignSelf: 'center', alignItems:'center', backgroundColor: 'transparent'}}>
                            <Text 
                                style={[TextStyle.caption2]}
                                category='h6'
                            >
                                Micrófono
                            </Text>
                        </Layout>
                        <Layout style={{flexGrow: 1, alignItems:'flex-end', backgroundColor: 'transparent'}}>
                            <CheckBox 
                                checked={audioGranted}
                                status={audioGranted ? 'success': 'primary'}
                                onChange={() => {
                                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(granted => setAudioGranted(granted));
                                }}
                            />
                        </Layout>
                        
                    </Layout>
                </Layout>
                <Layout style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '5%', backgroundColor: 'transparent'}}>
                    <Button style={{width: '90%'}}
                        disabled={!locationGranted || !cameraGranted || !audioGranted}
                        onPress={() => props.navigation.navigate('AppIntro')}
                    >
                        Continuar
                    </Button>
                </Layout>
                
                
            </Layout>
            

        </Layout>
    )
}


const Screen = withStyles(ConfigurarPermisosScreen, theme => ({
    welcomeLabel: {        
        color: theme['text-control-color'],
        ...TextStyle.headline,
        marginHorizontal: '5%',
    }
}))

const mapStateToProps = state => {
    return {
      profile: state.profile
    }
  }

export default connect(mapStateToProps, {})(Screen);
