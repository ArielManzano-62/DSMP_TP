import React from 'react';
import { Layout, Text, withStyles } from '@ui-kitten/components';
import TextStyle from '../constants/TextStyles';


class ProfileSetting extends React.Component {

   renderTextElement = (text, style) => {
    return (
      <Text
        style={style}
        appearance='hint'>
        {text}
      </Text>
    );
  };

   render() {
    const { style, themedStyle, hint, value, ...restProps } = this.props;
    const { container, hintLabel, valueLabel } = themedStyle;

    return (
      <Layout        
        {...restProps}
        style={[container, style]}>
        {hint ? this.renderTextElement(hint, hintLabel) : null}
        {this.renderTextElement(value, valueLabel)}
      </Layout>
    );
  }
}

export default withStyles(ProfileSetting, (theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  hintLabel: TextStyle.caption2,
  valueLabel: {
    color: theme['text-basic-color'],
    ...TextStyle.caption2,
  },
}));