import React, { Component } from 'react'
import {
    Layout, Button, Text, ButtonGroup
} from '@ui-kitten/components';
import { connect } from 'react-redux'

export class ThirdPageWizard extends Component {
    render() {
        return (
            <Layout style={{flex: 1, justifyContent: 'space-between'}}>
                <Text category='h6'>Seleccione puntos intermedios en su ruta (5 máx)</Text>
                <Text category='s1' style={{alignSelf: 'center'}}>Restantes: {5-this.props.waypoints.length}</Text>
                <ButtonGroup status='control' style={{justifyContent: 'flex-end'}}>
                    <Button 
                        status='control'
                        size='small'
                        onPress={this.props.onPreviousPage}
                    >
                        Atras
                    </Button>
                    <Button
                        status='control'
                        size='small'
                        onPress={this.props.onSubmit}
                    >
                        Siguiente
                    </Button>
                </ButtonGroup>
            </Layout>

        )
    }
}

const mapStateToProps = (state) => ({
    waypoints: state.ruta.waypoints
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPageWizard)
