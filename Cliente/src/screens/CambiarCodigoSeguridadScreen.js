import React, {useState, useEffect} from 'react';
import {
    Layout,
    Input,
    Button,
    TopNavigation,
    Icon,
    Text,
    TopNavigationAction,
    withStyles,    
    Spinner
} from '@ui-kitten/components';
import { connect } from 'react-redux';

import { cambiar_codigo_seguridad } from '../redux/actions';
import TextStyles from '../constants/TextStyles';

const CambiarCodigoSeguridadScreen = (props) => {
    const { themedStyle, theme } = props;
    const [codigoActual, setCodigoActual] = useState('');
    const [codigoActualCaption, setCodigoActualCaption] = useState('');
    const [codigoNuevo, setCodigoNuevo] = useState('');
    const [codigoNuevoCaption, setCodigoNuevoCaption] = useState('');
    const [codigoNuevoRepeticion, setCodigoNuevoRepeticion] = useState('');
    const [codigoNuevoRepeticionCaption, setCodigoNuevoRepeticionCaption] = useState('');

    const [actualTouched, setActualTouched] = useState(false);
    const [nuevoTouched, setNuevoTouched] = useState(false);
    const [repeticionTouched, setRepeticionTouched] = useState(false);

    const [codigoActualSecureTextEntry, setCodigoActualSecureTextEntry] = useState(true);
    const [codigoNuevoSecureTextEntry, setCodigoNuevoSecureTextEntry] = useState(true);
    const [codigoNuevoRepeticionSecureTextEntry, setCodigoNuevoRepeticionSecureTextEntry] = useState(true);

    const [sending, setSending] = useState(0);
        

    const validateInput = (value) => {
        const regex = new RegExp("^[0-9]{4}$");
        if (regex.test(value)) return true;
        return false;
    }

    useEffect(() => validateInputs(), [codigoActual, codigoNuevo, codigoNuevoRepeticion]);

    const validateInputs = () => {
        if (actualTouched) {
            if (!validateInput(codigoActual)) setCodigoActualCaption('4 dígitos')
            else setCodigoActualCaption('');
        }
        
        if (nuevoTouched) {
            if (!validateInput(codigoNuevo)) setCodigoNuevoCaption('4 dígitos'); 
            else if (codigoActual && codigoActual === codigoNuevo)  setCodigoNuevoCaption('El codigo nuevo no puede ser igual al actual');        
            else setCodigoNuevoCaption('');
        }
        
        if (repeticionTouched) {
            if (!validateInput(codigoNuevoRepeticion)) setCodigoNuevoRepeticionCaption('4 dígitos');
            else if (codigoNuevo && codigoNuevo !== codigoNuevoRepeticion) setCodigoNuevoRepeticionCaption('Los codigos no coinciden');        
            else setCodigoNuevoRepeticionCaption('');
        }
        
    }
    

    const validateForm = () => {
        return !(codigoActual != ''
            && codigoNuevo != ''
            && codigoNuevoRepeticion != ''
            && codigoActualCaption == ''
            && codigoNuevoCaption == ''
            && codigoNuevoRepeticionCaption == '')
    }

    const _cambiarCodigo = async () => {
        if (validateForm) {
            setSending(1);
            try {
                await props.cambiar_codigo_seguridad(codigoActual, codigoNuevo);
                setSending(2);
                setTimeout(() => {props.navigation.pop()}, 3000)
            } catch (error) {
                if (error.response.data.error_message == "Codigo actual erroneo");
                setCodigoActualCaption('Codigo actual incorrecto');
                setSending(0);
            }
            
            
        }
    }


    return(
        <Layout style={{flex: 1}}>
            <TopNavigation 
                title='Cambiar Codigo de Seguridad'
                alignment='center'
                style={{backgroundColor: theme['color-primary-default']}}
                titleStyle={themedStyle.headerTitle}
                leftControl={<TopNavigationAction 
                    icon={style => <Icon name='arrow-ios-back' style={style} tintColor={theme['text-control-color']}/>}
                    onPress={() => props.navigation.pop()}
                />}
            />
            <Layout style={{flex: 1, paddingHorizontal: '2%', paddingVertical: '2%'}}>
                <Input 
                    value={codigoActual}
                    placeholder='1234'
                    label='Codigo Actual'
                    icon={style => <Icon name={codigoActualSecureTextEntry ? 'eye-off' : 'eye'} {...style} />}
                    onIconPress={() => setCodigoActualSecureTextEntry(!codigoActualSecureTextEntry)}
                    secureTextEntry={codigoActualSecureTextEntry}
                    onChangeText={v => {
                        setCodigoActual(v); 
                        setActualTouched(true);
                    }}
                    status={codigoActualCaption ? 'danger' : 'primary'}
                    caption={codigoActualCaption}
                />
                <Layout style={{marginTop: '6%'}}>
                    <Input 
                        style={{marginBottom: '2%'}}
                        value={codigoNuevo}
                        placeholder='4321'
                        label='Codigo Nuevo'
                        icon={style => <Icon name={codigoNuevoSecureTextEntry ? 'eye-off' : 'eye'} {...style} />}
                        onIconPress={() => setCodigoNuevoSecureTextEntry(!codigoNuevoSecureTextEntry)}
                        secureTextEntry={codigoNuevoSecureTextEntry}
                        onChangeText={v => {
                            setCodigoNuevo(v);
                            setNuevoTouched(true);
                        }}
                        status={codigoNuevoCaption ? 'danger' : 'primary'}
                        caption={codigoNuevoCaption}
                    />
                    <Input 
                        value={codigoNuevoRepeticion}
                        placeholder='4321'
                        label='Repetir Codigo Nuevo'
                        icon={style => <Icon name={codigoNuevoRepeticionSecureTextEntry ? 'eye-off' : 'eye'} {...style} />}
                        onIconPress={() => setCodigoNuevoRepeticionSecureTextEntry(!codigoNuevoRepeticionSecureTextEntry)}
                        secureTextEntry={codigoNuevoRepeticionSecureTextEntry}
                        onChangeText={v => {
                            setCodigoNuevoRepeticion(v);
                            setRepeticionTouched(true);
                        }}
                        status={codigoNuevoRepeticionCaption ? 'danger' : 'primary'}
                        caption={codigoNuevoRepeticionCaption}
                    />
                </Layout>               
                
            </Layout>
            {sending == 0 && <Button 
                style={{width: '90%',alignSelf:'center', marginBottom: '5%'}}
                disabled={validateForm()}
                onPress={_cambiarCodigo}>
                    Cambiar
            </Button>}
            {sending == 1 && <Layout style={{alignSelf: 'center', marginBottom: '5%'}}>
                <Spinner  />
                </Layout>}
            {sending == 2 && 
            <Layout style={{alignSelf: 'center',justifyContent: 'center', alignItems:'center', marginBottom: '5%'}}>
                <Icon name='checkmark' width={24} height={24} tintColor={theme['color-success-default']}/>
                <Text>Código cambiado</Text>
            </Layout>}

            
        </Layout>
    )
}

CambiarCodigoSeguridadScreen.navigationOptions = {header: null}

const Screen = withStyles(CambiarCodigoSeguridadScreen, theme => ({
    headerTitle: {
        color: theme['text-control-color'],
        ...TextStyles.headline,
        fontWeight: 'bold'
    },
}))

export default connect(null, {
    cambiar_codigo_seguridad
})(Screen);