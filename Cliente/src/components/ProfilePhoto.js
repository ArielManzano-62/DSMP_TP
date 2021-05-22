import React from 'react';
import {
    Layout,
    Avatar,
    Icon,
    withStyles,
    Button
} from '@ui-kitten/components';


class ProfilePhoto extends React.Component {

    renderEditElement = () => {
        const buttonElement  = this.props.button();

        return React.cloneElement(buttonElement, {
            style: [buttonElement.props.style, this.props.themedStyle.editButton],
        });
    };

    render() {
        const { style, themedStyle, button, ...restProps } = this.props;

        return (
          <Layout style={style}>
            <Avatar
              style={[style, themedStyle.avatar]}
              {...restProps}
            />
            {button ? this.renderEditElement() : null}
          </Layout>
        );
    }
}

export default withStyles(ProfilePhoto, (theme) => ({
    avatar: {
      alignSelf: 'center',
    },
    editButton: {
      position: 'absolute',
      alignSelf: 'flex-end',
    },
  }));