import React, {useState, useEffect} from 'react';
import { Dimensions, Image } from 'react-native';
import { 
    withStyles,
    Layout,
    CheckBox,
    Icon,
    Button,
    Spinner,
    Modal,
    Text,
    Input
} from '@ui-kitten/components';
import axios from 'axios';
import TextStyles from '../constants/TextStyles';
import ValidationInput from '../components/common/ValidationInput';
import {
    EmailValidator,
    PasswordValidator,
    ConfirmPasswordValidator,
    NameValidator
} from '../utils/validators';
import ScrollableAvoidKeyboard from '../components/common/ScrollableAvoidKeyboard';
import RegistroHeader from '../components/header/RegistroHeader';
import { gruposEndpoint } from '../api';



var {height, width} = Dimensions.get('window');

const EmailIcon = (style) => (
    <Icon name='email' {...style} />
);

const PasswordIcon = (style) => (
    <Icon name='eye-off' {...style} />
);

const NameIcon = (style) => (
    <Icon name='person' {...style} />
);

let source = axios.CancelToken.source();

const SignUpScreen = (props) => {
    const {themedStyle, theme} = props;
    const [emailValue, setEmail] = useState('');
    const [emailCaption, setEmailCaption] = useState('');
    const [passwordValue, setPassword] = useState('');
    const [passwordCaption, setPasswordCaption] = useState('');
    const [confirmPasswordValue, setConfirmPassword] = useState('');
    const [confirmPasswordCaption, setConfirmPasswordCaption] = useState('');
    const [nameValue, setName] = useState('');
    const [nameCaption, setNameCaption] = useState('');
    const [familyNameValue, setFamilyName] = useState('');
    const [familyNameCaption, setFamilyNameCaption] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);
    const [familyNameTouched, setFamilyNameTouched] = useState(false);

    const [renderSpinner, setRenderSpinner] = useState(false);
    const [emailStateStatus, setEmailStateStatus] = useState(undefined);

    const [passwordSecureTextEntry, setPasswordSecureTextEntry] = useState(true);
    const [confirmPasswordSecureTextEntry, setConfirmPasswordSecureTextEntry] = useState(true);

    const [registrando, setRegistrando] = useState(0);

    
    

        
    useEffect(() => validateInputs(), [emailValue, passwordValue, confirmPasswordValue, nameValue, familyNameValue]);    

    const validateInputs = () => {
        if (emailTouched) {
            if (!EmailValidator(emailValue)) {
                setEmailCaption('Formato de email invalido')
                setEmailStateStatus('danger')
            }
        }
        
        if (passwordTouched) {
            if (!PasswordValidator(passwordValue)) setPasswordCaption('Debe contener 8 caracteres, mayusculas, minusculas y numeros');       
            else setPasswordCaption('');
        }
        
        if (confirmPasswordTouched) {
            if (!ConfirmPasswordValidator(passwordValue)(confirmPasswordValue)) setConfirmPasswordCaption('Las contraseñas no coinciden');  
            else setConfirmPasswordCaption('');
        }

        if (nameTouched) {
            if (!NameValidator(nameValue)) setNameCaption('Formato de nombre invalido');
            else setNameCaption('');
        } 

        if (familyNameTouched) {
            if (!NameValidator(familyNameValue)) setFamilyNameCaption('Formato de apellido invalido');
            else setFamilyNameCaption('');
        }        
    }
    
    const onTermsValueChanged = (termsAccepted) => {
        setTermsAccepted(termsAccepted);
    }

    const onEmailInputTextChanged = (email) => { 
        source.cancel();
        source = axios.CancelToken.source();
        setEmail(email); 
        setEmailTouched(true);       
        if (EmailValidator(email) == true) {
            setEmailStateStatus('warning');
            setEmailCaption('Validando Email')

            axios.get(`${gruposEndpoint}/api/register?email=${email}`, {
                cancelToken: source.token
            })            
            .then(res => {
                setEmailStateStatus('danger');
                setEmailCaption('Email en uso')
            })
            .catch(error => {
                if (axios.isCancel(error)) {return;}
                setEmailStateStatus('success');
                setEmailCaption('');        
            });
        }   
    }

    const onPasswordInputValidationResult = (password) => {
        setPassword(password);
        setPasswordTouched(true);
        
    }

    const onPasswordConfirmationInputValidationResult = (confirmPassword) => {
        setConfirmPassword(confirmPassword);
        setConfirmPasswordTouched(true);
        
    }

    const onNameInputTextChanged = (name) => {
        setName(name);
        setNameTouched(true);
    }

    const onFamilyNameInputTextChanged = (family_name) => {
        setFamilyName(family_name);
        setFamilyNameTouched(true);
    }   


    const isValid = () => {

        return (emailValue != ''
            && EmailValidator(emailValue)
            && passwordValue != ''
            && confirmPasswordValue != ''
            && nameValue != ''
            && familyNameValue != ''
            && termsAccepted
            && emailCaption == ''
            && passwordCaption == ''
            && confirmPasswordCaption == ''
            && nameCaption == ''
            && familyNameCaption == ''
        )
    }

    const onPress = () => {
        setRegistrando(1);
        axios.post(`${gruposEndpoint}/api/register/crear`, {
            email: emailValue,
            nombre: nameValue,
            apellido: familyNameValue,
            password: passwordValue
        }).then(() => {
            setRegistrando(2)
            setTimeout(props.navigation.pop, 3000);
        })
        .catch(err => {
            setRegistrando(0);
            setEmailStateStatus('danger');
            setEmailCaption('No se pudo crear la cuenta, intente mas tarde');
        });
       
    }
        

    return (
        <Layout style={{flex: 1}}>                       
            <RegistroHeader onBack={() => props.navigation.pop()}/>
            <ScrollableAvoidKeyboard style={themedStyle.container}>                          
                <Layout style={themedStyle.formContainer}>                    
                    <Layout>
                        <Input
                            autoCapitalize='none'
                            style={themedStyle.emailInput}
                            value={emailValue}
                            onChangeText={onEmailInputTextChanged}
                            caption={emailCaption}
                            status={!emailTouched ? 'primary' : emailStateStatus}
                            placeholder='Email'
                            textStyle={TextStyles.paragraph}
                            icon={EmailIcon}
                        />                            
                        <Input 
                            style={themedStyle.passwordInput}
                            textStyle={TextStyles.paragraph}
                            autoCapitalize='none'
                            secureTextEntry={passwordSecureTextEntry}
                            value={passwordValue}
                            placeholder='Contraseña'
                            icon={style => <Icon {...style} name={passwordSecureTextEntry ? 'eye-off' : 'eye'}/>}
                            onIconPress={() => setPasswordSecureTextEntry(!passwordSecureTextEntry)}
                            onChangeText={onPasswordInputValidationResult}
                            status={passwordCaption ? 'danger' : 'primary'}
                            caption={passwordCaption}
                        />
                        <Input 
                            style={themedStyle.passwordInput}
                            textStyle={TextStyles.paragraph}
                            autoCapitalize='none'
                            secureTextEntry={confirmPasswordSecureTextEntry}
                            value={confirmPasswordValue}
                            placeholder='Confirmar Contraseña'
                            icon={style => <Icon {...style} name={confirmPasswordSecureTextEntry ? 'eye-off' : 'eye'}/>}
                            onIconPress={() => setConfirmPasswordSecureTextEntry(!confirmPasswordSecureTextEntry)}
                            onChangeText={onPasswordConfirmationInputValidationResult}
                            status={confirmPasswordCaption ? 'danger' : 'primary'}
                            caption={confirmPasswordCaption}
                        />
                        <Input 
                            style={themedStyle.nameInput}
                            textStyle={TextStyles.paragraph}
                            value={nameValue}
                            autoCapitalize='none'
                            placeholder='Nombre'
                            icon={NameIcon}
                            onChangeText={onNameInputTextChanged}
                            status={nameCaption ? 'danger' : 'primary'}
                            caption={nameCaption}
                        />
                        <Input 
                            style={themedStyle.familyNameInput}
                            textStyle={TextStyles.paragraph}
                            value={familyNameValue}
                            autoCapitalize='none'
                            placeholder='Apellido/s'
                            icon={NameIcon}
                            onChangeText={onFamilyNameInputTextChanged}
                            status={familyNameCaption ? 'danger' : 'primary'}
                            caption={familyNameCaption}
                        />
                        <CheckBox
                            style={themedStyle.termsCheckBox}
                            textStyle={themedStyle.termsCheckBoxText}
                            checked={termsAccepted}
                            onChange={onTermsValueChanged}
                            text='He leido y acepto los Terminos y Condiciones'
                        />
                    </Layout>
                </Layout>
                <Layout style={{justifyContent: 'flex-end', marginBottom: '2%', alignItems: 'center'}}>
                    {registrando == 0 &&
                    <Button 
                        style={[themedStyle.signUpButton, {alignSelf: 'stretch'}]}
                        textStyle={TextStyles.button}
                        size='large'
                        disabled={!isValid()}
                        onPress={onPress}
                    >
                        Registrarse
                        
                    </Button>}
                    {registrando == 1 && 
                    <Spinner/>
                    }
                    {registrando == 2 && 
                    <>
                        <Icon name='checkmark' width={24} height={24} tintColor={theme['color-success-default']}/>
                        <Text>Cuenta Creada</Text>
                    </>
                    }
                </Layout>
            </ScrollableAvoidKeyboard>
        </Layout>
    );
    
}

SignUpScreen.navigationOptions = {
    header: null,
};

export default withStyles(SignUpScreen, (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
    },
    formContainer: {
        flex: 3,
        marginTop: 32,
        paddingHorizontal: 16,
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    signUpButton: {
        marginHorizontal: 16,
        marginTop: 24,
    },
    welcomeLabel: {        
        color: theme['text-control-color'],
        marginBottom: height * 0.02,
        //marginTop: height * 0.05,
        ...TextStyles.headline,
        fontWeight: 'bold'

    },
    emailInput: {
        marginTop: 16,
    },
    passwordInput: {
        marginTop: 16,
    },
    nameInput: {
        marginTop: 16,
    },
    familyNameInput: {
        marginTop: 16,
    },
    termsCheckBox: {
        marginTop: 24,
    },
    termsCheckBoxText: {
        color: theme['text-hint-color'],
        ...textStyle.subtitle,
    },
}))

