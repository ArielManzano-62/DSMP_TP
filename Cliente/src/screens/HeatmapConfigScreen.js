import React from 'react';
import {
    Dimensions
} from 'react-native';
import {
    Layout,
    Button,
    Icon,
    Text,
    ButtonGroup,
    RadioGroup,
    Radio,
    Select,
    withStyles
} from '@ui-kitten/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-with-locales-es6';

import DateRangePicker from '../utils/DateRangePicker';
import Textstyles from '../constants/TextStyles';

var {height, width} = Dimensions.get('window');

const CalendarIcon = (style) => (
    <Icon name='calendar' {...style} />
);


class HeatmapConfigScreen extends React.Component {
    constructor(props) {
        super(props);
        moment.locale('es');

        this.state = {
            startDate: null,
            endDate: null,
            selectedOption: null
        }
    }

    data = [
        { text: 'Asalto' },
        { text: 'Emergencia Medica' },
        { text: 'Incendio' },
    ]

    renderPickerInicio = () => {
        if (this.state.renderPickerInicio) {
            return (
                <DateTimePicker 
                value={this.state.startDate == null ? new Date() : this.state.startDate}
                is24Hour={true}
                display="default"
                maximumDate={this.state.endDate == null ? new Date() : moment(this.state.endDate).subtract(1, 'days').valueOf()}
                onChange={(event, date) => {
                    this.setState({ startDate: date, renderPickerInicio: false});
                }} />
            );
        }
    }

    renderPickerFin = () => {
        if (this.state.renderPickerFin) {
            return (
                <DateTimePicker 
                value={moment(this.state.startDate).add(1, 'days').valueOf()}
                is24Hour={true}
                display="default"
                minimumDate={moment(this.state.startDate).add(1, 'days').valueOf()}
                maximumDate={new Date()}
                onChange={(event, date) => {
                    this.setState({ endDate: date, renderPickerFin: false});
                }} />
            );
        }
    }

    render() {
        const {themedStyle} = this.props;
        return (
            <Layout style={[{flex: 1, alignItems: 'center', paddingHorizontal: width * 0.05}, themedStyle.container]}>
                <Layout style={{marginTop: 20, backgroundColor: 'transparent'}}>
                    <Text category='h5'>
                        Consultar densidad de eventos
                    </Text>
                </Layout>
                
                <Layout style={{flexDirection: 'column', justifyContent: 'space-around', marginBottom: 20, alignSelf: 'stretch', backgroundColor: 'transparent'}}>  
                        <Button 
                        appearance='outline' 
                        icon={CalendarIcon}
                        style={{ marginBottom: 10}}
                        onPress={() => this.setState({ renderPickerInicio: true})}>
                            {this.state.startDate == null ? 'Fecha Inicio' : moment(this.state.startDate).format('L')}
                        </Button>
                        <Button 
                        appearance='outline'
                        icon={CalendarIcon}
                        disabled={this.state.startDate == null ? true : false}
                        onPress={() => this.setState({ renderPickerFin: true})}
                        >
                            {this.state.endDate == null ? 'Fecha Fin' : moment(this.state.endDate).format('L')}
                        </Button>
                        {this.renderPickerInicio()}
                        {this.renderPickerFin()}
                        <Select
                        style={{alignSelf: 'stretch'}}
                        data={this.data}
                        placeholder='Tipo de Evento'
                        selectedOption={this.state.selectedOption}
                        onSelect={(opt) => {console.log(opt); this.setState({ selectedOption: opt})}}
                        />
                </Layout>

                <Layout style={{flex: 2, flexDirection: 'column', justifyContent: 'space-around', alignItems:'center', backgroundColor: 'transparent', alignSelf: 'stretch', paddingBottom: 5}}>
                    
                    <Button 
                    style={{alignSelf: 'stretch', paddingBottom: 10}}
                    disabled={(this.state.selectedOption != null && this.state.endDate != null && this.state.startDate != null) ? false : true}>
                        Consultar
                    </Button>
                                      
                </Layout>
                
            </Layout>
        );
    }
}

HeatmapConfigScreen.navigationOptions = { header: null }

export default withStyles(HeatmapConfigScreen, (theme) => {
    return ({
        container: {
            backgroundColor: theme['background-basic-color-2'],
            flex: 1
        },
        calendarContainer: {
            backgroundColor: theme['background-basic-color-1'],            
            paddingVertical: height * 0.02,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        iconFill: {
            fill: theme['color-primary-default']
        },
        radioContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 20
        },
        radio: {
            flex: 1,
        }

    });
});

/*
<Layout
                style={themedStyle.calendarContainer}
                >                    
                    <Layout style={{flex: 4, paddingLeft: width * 0.05}}>                    
                        <Button 
                        appearance='outline' 
                        icon={CalendarIcon}
                        size='small'
                        style={{ marginBottom: 10}}
                        onPress={() => this.setState({ renderPickerInicio: true})}>
                            {this.state.startDate == null ? 'Fecha Inicio' : moment(this.state.startDate).format('L')}
                        </Button>
                        <Button 
                        appearance='outline'
                        icon={CalendarIcon}
                        disabled={this.state.startDate == null ? true : false}
                        size='small'
                        onPress={() => this.setState({ renderPickerFin: true})}
                        >
                            {this.state.endDate == null ? 'Fecha Fin' : moment(this.state.endDate).format('L')}
                        </Button>
                        {this.renderPickerInicio()}
                        {this.renderPickerFin()}
                    </Layout>
                    <Layout style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                        <Icon name='arrow-circle-right-outline' style={{width: 30, height: 30}} fill={themedStyle.iconFill.fill} animation='pulse'/>                        
                    </Layout>
                </Layout>*/