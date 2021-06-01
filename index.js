/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AlbumList from './src/components/AlbumList';
import PhotoList from './src/components/PhotoList';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './src/redux/store'

const Stack = createStackNavigator();


// Create a component
const App = () => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="albumList"
          component={AlbumList}
          options={{title: 'Albums'}}
        />
        <Stack.Screen
          name="photoList"
          component={PhotoList}
          options={{title: 'Photos'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);
