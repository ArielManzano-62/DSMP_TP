import {
  createStackNavigator,
} from 'react-navigation';

import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';

const LoginStack = createStackNavigator({
    IniciarSesion: {screen: SignInScreen},
    SignUp: {screen: SignUpScreen}
  });

export default LoginStack