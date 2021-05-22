import React from 'react';
import {
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import 
    MapView, {
    Heatmap,
    PROVIDER_GOOGLE
} from "react-native-maps";
import {
    Layout,
    withStyles,
    Button,
    Icon,
    Text,
    Tooltip,
    ButtonGroup,
    Spinner,
    Popover
} from '@ui-kitten/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-with-locales-es6';
import axios from 'axios';

import DateRangePicker from '../utils/DateRangePicker';
import Textstyles from '../constants/TextStyles';
import {eventosEndpoint, gruposEndpoint} from '../api';

var {height, width} = Dimensions.get('window');

const CalendarIcon = (style) => (
    <   Icon name='calendar' {...style} />
    );

class HeatmapScreen extends React.Component {
    constructor(props) {
        moment.locale('es');
        super(props);

        this.state = {
            tooltipVisible: false,
            renderPickerInicio: false,
            renderPickerFin: false,
            startDate: null,
            endDate: null,
            showSpinner: false,
            points: [],
        }
    }

    onSelect = (range) => {
        console.log(range);
        this.setState({ range });
    };

    searchOnPress = async () => {
        if (this.state.startDate == null || this.state.endDate == null) {
            return;
        }
        this.setState({ showSpinner: true });
        try {
            const points = await axios.post(`${gruposEndpoint}/api/eventos/estadisticas`, {
                desde: this.state.startDate,
                hasta: this.state.endDate,
            });
            if (points.data.length == 0) {
                this.setState({ showSpinner: false, });
                this.setState({tooltipVisible: true})
                setTimeout(() => {
                    this.setState({tooltipVisible: false})
                }, 5000);
                return;
            }
            setTimeout(() => {
                this.setState({showSpinner: false, points: points.data});
            }, 1300);

        }
        catch (err) {
            console.log(err);
            this.setState({showSpinner: false});
        }

    }

    renderButton = () => {
        const {themedStyle} = this.props;

        if (this.state.showSpinner) {
            return (<Spinner status='primary' />)
        } else {
            return (
                <TouchableOpacity onPress={() => this.searchOnPress()}>
                    <Layout style={{width: 30, height: 30, borderRadius: 15}} level='2'>
                        <Icon name='search' style={{width: 30, height: 30,}} fill={themedStyle.iconFill.fill}/>
                    </Layout>                                        
                </TouchableOpacity>
                
            );
        }
    }

    renderPickerInicio = () => {
        if (this.state.renderPickerInicio) {
            return (
                <DateTimePicker 
                value={this.state.startDate == null ? new Date() : this.state.startDate}
                is24Hour={true}
                display="default"
                maximumDate={this.state.endDate == null ? new Date() : moment(this.state.endDate).subtract(1, 'days').valueOf()}
                onChange={(event, date) => {
                    this.setState({ startDate: moment(date).startOf('day').toDate(), renderPickerInicio: false});
                }} />
            );
        }
    }

    renderPickerFin = () => {
        if (this.state.renderPickerFin) {
            return (
                <DateTimePicker 
                value={moment(this.state.startDate).valueOf()}
                is24Hour={true}
                display="default"
                minimumDate={moment(this.state.startDate).valueOf()}
                maximumDate={new Date()}
                onChange={(event, date) => {
                    this.setState({ endDate: moment(date).add(1, 'days').startOf('day').toDate(), renderPickerFin: false});
                    console.log(this.state.startDate);
                    console.log(this.state.endDate);
                }} />
            );
        }
    }

    render() {
        const {themedStyle} = this.props;
        return (
            <Layout style={themedStyle.container}>
                    <MapView provider={PROVIDER_GOOGLE} style={{flexGrow: 1}}>
                        {this.state.points.length > 0 ? <Heatmap 
                        points={this.state.points}
                        /> : null}                    
                    </MapView>
                    <Layout style={themedStyle.tooltip} elevation={20}>                        
                        <Layout style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 10}}>
                            <Text category='h6' style={{alignSelf: 'center', ...Textstyles.headline, marginBottom: 5}}>Densidad de Asaltos</Text>
                            <Layout style={{flexDirection: 'row', backgroundColor: 'transparent'}}>                            
                                <Layout style={{flex: 5, flexDirection: 'column', justifyContent: 'center', backgroundColor: 'transparent', marginVertical: 5, }}>
                                    <Button appearance='outline' size='tiny' style={{marginBottom: 5}} onPress={() => this.setState({renderPickerInicio: true})}>
                                        {this.state.startDate == null ? 'Fecha Inicio' : moment(this.state.startDate).format('L')} 
                                    </Button>
                                    <Button appearance='outline' size='tiny' style={{marginTop: 5}} disabled={this.state.startDate == null} onPress={() => this.setState({renderPickerFin: true})}>
                                        {this.state.endDate == null ? 'Fecha Fin' : moment(this.state.endDate).format('L')}
                                    </Button>                                 
                                                                        
                                    {this.renderPickerInicio()}
                                    {this.renderPickerFin()}
                                </Layout>
                                <Layout style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                                    {this.renderButton()}
                                </Layout>          
                            </Layout>                        
                        </Layout>                        
                    </Layout>
                    {this.state.tooltipVisible ?
                    <Layout level='2' style={{position: 'absolute', alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 5, top: height * 0.2, borderRadius: 10}}>
                        <Text category='label' style={Textstyles.caption2}>No se encontraron registros</Text>
                    </Layout> :
                    null
                    } 
                    
                                 
            </Layout>
        );
    }
}

HeatmapScreen.navigationOptions = { header: null }

export default withStyles(HeatmapScreen, (theme) => {
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
        tooltip: {
            position: 'absolute',
            alignSelf: 'center',
            width: width * 0.95,
            
            backgroundColor: theme['background-basic-color-2'],
            
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
        theme,
    });
});