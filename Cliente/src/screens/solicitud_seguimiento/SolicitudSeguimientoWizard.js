import React, { Component } from 'react';
import {
    Layout
} from '@ui-kitten/components';
import { connect } from 'react-redux';
  
import { iniciar_seguimiento, next_page_seguimiento, previous_page_seguimiento} from '../../redux/actions';
import FirstPageWizard from './FirstPageWizard';
import SecondPageWizard from './SecondPageWizard';
import ThirdPageWizard from './ThirdPageWizard';
import FourthPageWizard from './FourthPageWizard';

export class SolicitudSeguimientoWizard extends Component {
    nextPage = () => {
        this.props.next_page_seguimiento();
    }

    previousPage = () => {
        this.props.previous_page_seguimiento();
    }

    onSubmit = () => {
        this.props.onSubmit();

    }

    render() {
        return (
            <Layout style={{...this.props.style}}>
                {this.props.page === 1 && <FirstPageWizard onSubmit={this.nextPage} />}
                {this.props.page === 2 && <SecondPageWizard onPreviousPage={this.previousPage} onSubmit={this.nextPage} />}
                {this.props.page === 3 && <ThirdPageWizard onPreviousPage={this.previousPage} onSubmit={this.nextPage}/>}
                {this.props.page === 4 && <FourthPageWizard style={{maxHeight: this.props.style.maxHeight * 0.5}} onPreviousPage={this.previousPage} onSubmit={this.onSubmit}/>}
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    page: state.ruta.page
})
export default connect(mapStateToProps, {next_page_seguimiento, previous_page_seguimiento})(SolicitudSeguimientoWizard);
