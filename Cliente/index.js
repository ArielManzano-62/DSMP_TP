import React from 'react';
import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {mapping, light as lightTheme} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { PersistGate } from 'redux-persist/es/integration/react';

import App from './App';
import {name as appName} from './app.json';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import reducers from './src/redux/reducers';
import { refreshToken, logger } from './src/redux/store/Middlewares';
import { myTheme } from './src/constants/custom-theme';
import { MaterialIconsPack } from './src/constants/MaterialIcons';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2f95dc',
    accent: '#f1c40f',
  }
};

const persistConfig = {
  key: 'mensajesLeidos',
  storage: AsyncStorage,
  whitelist: ['mensajesLeidos']
}

const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer, applyMiddleware(refreshToken, logger, thunk));
const persistor = persistStore(store);

const scrictTheme = { ['text-font-family']: 'Roboto' };
const customMapping = { strict: scrictTheme };


const RNRedux = () => {
  return (
  <Provider store = { store }>
    <PersistGate persistor={persistor} loading={null}>
      <PaperProvider theme={ theme }>
        <IconRegistry icons={[EvaIconsPack, MaterialIconsPack]}/> 
        <ApplicationProvider
          mapping={mapping}
          theme={myTheme}
          customMapping={customMapping}>                 
          <App />
        </ApplicationProvider>
      </PaperProvider>
    </PersistGate>        
  </Provider>
  );
}

AppRegistry.registerComponent(appName, () => RNRedux);
