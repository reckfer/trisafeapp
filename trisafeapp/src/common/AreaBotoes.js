/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
// import { styles} from './Estilos';

export default class AreaBotoes extends Component {

    constructor(props) {
        super(props);
    }
            
    render() {

        return (
            <View >
                <ButtonGroup
                    buttons={this.props.botoes}
                    buttonStyle={ {alignItems: 'stretch'} }
                />
            </View>
        );
    }
}