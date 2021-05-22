import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // <-- Import Feather icons

export const MaterialIconsPack = {
  name: 'material',
  icons: createIconsMap(),
};

function createIconsMap() {

  return new Proxy({}, {
    get(target, name) {
      return IconProvider(name);
    },
  });
}

function IconProvider(name) {
    return {
      toReactElement: (props) => FeatherIcon({ name, ...props }),
    };
  }
  
  function FeatherIcon({ name, style }) {
    const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
    return (
      <Icon
        name={name}
        size={height}
        color={tintColor}
        style={iconStyle}
      />
    );
}