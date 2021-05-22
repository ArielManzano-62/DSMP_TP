import React from 'react';
import {
    withStyles
} from '@ui-kitten/components';
import {
    Input,
} from '@ui-kitten/components';

class ValidationInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { value: oldValue } = prevState;
        const { value: newValue } = this.state;
    
        const becomeValid = !this.isValid(oldValue) && this.isValid(newValue);
        const becomeInvalid = !this.isValid(newValue) && this.isValid(oldValue);
    
        if (becomeValid) {
          this.props.onChangeText(newValue);
        } else if (becomeInvalid) {
          this.props.onChangeText(undefined);
        }
      }

    onChangeText = (text) => {
        const { formatter } = this.props;

        const value = formatter ? formatter(text, this.state.value) : text;
        
        this.setState({value}, this.onValueChange);
    }

    onValueChange = () => {
        const { value } = this.state;
        
        if (this.isValid(value) && this.props.onChangeText) {
            this.props.onChangeText(value);
        }
    }

    isValid =  (value) => {
        const { validator } = this.props;

        return  validator(value);
    }

    getStatus = () => {
        const { value } = this.state;

        if (value && value.length) {
            return  this.isValid(value) ? 'success' : 'danger';
        }

        return undefined;
    }


    render() {
        const { style, themedStyle, captionText, ...restProps } = this.props;
        

        return (
            <Input
                autoCapitalize='none'
                status={this.getStatus()}
                caption={(this.isValid(this.state.value) || this.state.value == null || this.state.value == '') ? '' : (captionText ? captionText : '')}
                {...restProps}
                value={this.state.value}
                style={[themedStyle.container, style]}
                onChangeText={this.onChangeText}
            />
        )
        
    }    
}

export default withStyles(ValidationInput, (theme) => ({
    container: {}
}));