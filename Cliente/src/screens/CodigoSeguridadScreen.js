import React, {useState, useEffect} from 'react';
import {
    Layout,
    TopNavigation,
    Text,
    Button,
    Input,
    Icon,
    Spinner,
    withStyles,
} from '@ui-kitten/components';
import axios from 'axios';

import ValidationInput from '../components/common/ValidationInput';
import TextStyles from '../constants/TextStyles';
import { SecurityCodeValidator, ConfirmPasswordValidator } from '../utils/validators';
import { gruposEndpoint } from '../api';
import ScrollableAvoidKeyboard from '../components/common/ScrollableAvoidKeyboard';

const CodigoSeguridadScreen = props => {
    const {themedStyle} = props;

    const [codigo, setCodigo] = useState('');
    const [confirmCodigo, setConfirmCodigo] = useState('');

    const [codigoCaption, setCodigoCaption] = useState('');
    const [confirmCodigoCaption, setConfirmCodigoCaption] = useState('');

    const [codigoTouched, setCodigoTouched] = useState(false);
    const [confirmCodigoTouched, setConfirmCodigoTouched] = useState(false);

    const [codigoSecureTextEntry, setCodigoSecureTextEntry] = useState(true);
    const [confirmCodigoSecureTextEntry, setConfirmCodigoSecureTextEntry] = useState(true);

    const [renderSpinner, setRenderSpinner] = useState(false);

    useEffect(() => validateInputs(), [codigo, confirmCodigo])

    const validateInput = (value) => {
        const regex = new RegExp("^[0-9]{4}$");
        if (regex.test(value)) return true;
        return false;
    }

    const validateInputs = () => {
        if (codigoTouched) {
            if (!validateInput(codigo)) setCodigoCaption('4 digitos');
            else setCodigoCaption('');
        }

        if (confirmCodigoTouched) {
            if (!validateInput(confirmCodigo)) setConfirmCodigoCaption('Los códigos no coinciden');
            else setConfirmCodigoCaption('');
        }
    }

    const codigoInputchange = (value) => {
        setCodigo(value);
        setCodigoTouched(true);
    }

    const confirmationInputChange = (value) => {
        setConfirmCodigo(value);
        setConfirmCodigoTouched(true);
    }

    const isValid = () => (
        codigo != ''
        && confirmCodigo != ''
        && codigoCaption == ''
        && confirmCodigoCaption == ''
    )

    const _onPress = async () => {
        if (isValid()) {
            setRenderSpinner(true);
            await axios.post(`${gruposEndpoint}/api/usuarios/codigo-seguridad`, {
                codigoAntiguo: '',
                codigoNuevo: codigo
            })
            .then(() => {
                setTimeout(() => {
                    props.navigation.navigate('ConfigurarPermisos');
                }, 1000);
            })
            .catch((err) => setRenderSpinner(false))
        }
    }

    const renderAction = () => {
        if (renderSpinner) {
            return (
                <Spinner size='medium' status='primary' />
            );
        }
        else {
            return (
                <Button 
                style={{alignSelf: 'stretch'}}
                textStyle={TextStyles.button}
                size='medium'
                disabled={!isValid()}
                onPress={_onPress}
                >
                    Guardar                            
                </Button>
            );
        }
    }

    return (
        
        <Layout style={{flex: 1}}>         
            <Layout style={themedStyle.container} level='2'>                        
                <Layout level='2' style={{paddingHorizontal: '5%', paddingVertical: '5%', alignItems: 'center'}}>
                    <Text
                    category='h4'
                    style={themedStyle.title}>
                        Código de Seguridad
                    </Text>
                    <Text
                    category ='s2'
                    style={{textAlign: 'justify', marginBottom: '2.5%'}}>
                        El código de seguridad es utilizado para cerrar las alertas que uno ha enviado. Jamás revele este código.
                    </Text>                        
                    <Input 
                    size='medium'
                    placeholder='Codigo de Seguridad'
                    label='Ingrese código de seguridad:'
                    status={codigoCaption ? 'danger' : 'primary'}
                    secureTextEntry={codigoSecureTextEntry}
                    icon={style => <Icon name={codigoSecureTextEntry ? 'eye-off' : 'eye'} {...style}/>}
                    onIconPress={() => setCodigoSecureTextEntry(!codigoSecureTextEntry)}
                    caption={codigoCaption}
                    style={{marginVertical: '2%'}}
                    onChangeText={codigoInputchange}
                    />
                    <Input 
                    size='medium'
                    placeholder='Repetir'
                    label='Ingrese nuevamente el código de seguridad:'
                    status={confirmCodigoCaption ? 'danger' : 'primary'}
                    secureTextEntry={confirmCodigoSecureTextEntry}
                    icon={style => <Icon name={confirmCodigoSecureTextEntry ? 'eye-off' : 'eye'} {...style}/>}
                    onIconPress={() => setConfirmCodigoSecureTextEntry(!confirmCodigoSecureTextEntry)}
                    caption={confirmCodigoCaption}
                    style={{marginVertical: '2%'}}
                    onChangeText={confirmationInputChange}
                    />                        
                </Layout>
                <Layout level='2' style={[{alignItems: 'center', justifyContent: 'center'}, themedStyle.signUpButton]}>
                    {renderAction()}
                </Layout>                                                                      
            </Layout>            
        </Layout>
    );
    
}

CodigoSeguridadScreen.navigationOptions = {header: null}

export default withStyles(CodigoSeguridadScreen, (theme) => {
    return ({
        headerContainer: {
            backgroundColor: theme['background-primary-color-1'],
        },
        headerTitle: {
            color: theme['text-control-color'],
            ...TextStyles.headline,
            fontWeight: 'bold'
        },
        scrollViewContainer: {
            flex: 1,
            backgroundColor: theme['background-basic-color-2']
        },
        container: {
            flex: 1,
            justifyContent: 'space-between', 
        },
        action: {
            color: theme['text-control-color'],
        },
        input: {
            marginTop: 24,
            marginHorizontal: 12
        },
        button: {
            marginBottom: 24,
            marginHorizontal: 12
        },
        title: {
            fontSize: 30,
            color: theme['text-basic-color'],
            fontWeight: '100',
            marginBottom: '5%'
        },
        signUpButton: {
            marginHorizontal: '5%',
            marginBottom: 24
        },
    });
})

