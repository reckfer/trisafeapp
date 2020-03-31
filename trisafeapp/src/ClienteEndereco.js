/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    ScrollView,
    Alert,
    View,
} from 'react-native';
import { ThemeProvider, Input, Button } from 'react-native-elements';
import Util from './common/Util';
import Cabecalho from './common/CabecalhoTela';
import { styles, theme } from './common/Estilos';
import AreaBotoes from './common/AreaBotoes';
import GerenciadorDadosApp from './common/GerenciadorDadosApp';

export default class ClienteEndereco extends Component {
    static navigationOptions = {
        title: 'ClienteEndereco'
    }
    constructor(props) {
        super(props);
        let oNavigation = this.props.navigation;
        this.limpar = this.limpar.bind(this);
        this.confirmar = this.confirmar.bind(this);
        this.voltar = this.voltar.bind(this);
        
        oUtil = new Util();
        oGerenciadorDadosApp = new GerenciadorDadosApp(oNavigation);

        this.state = oGerenciadorDadosApp.getDadosAppGeral();
    }
    limpar() {
        let oDadosAppGeral = this.state;

        oDadosAppGeral.cliente.cidade = '';
        oDadosAppGeral.cliente.rua = '';
        oDadosAppGeral.cliente.numero = '';
        oDadosAppGeral.cliente.complemento = '';
        oDadosAppGeral.cliente.bairro = '';
        oDadosAppGeral.cliente.cep = '';
        oDadosAppGeral.cliente.uf = '';
        this.setState(oDadosAppGeral);
    }

    confirmar() {
        const { navigation } = this.props;
        
        // if(this.validarDadosPessoais()) {
            this.state.emCadastro = false;
            navigation.navigate('ClienteConfirmacao', this.state);
        // }
    }

    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteDadosPessoais', this.state);
    }

    render() {
        let dadosApp = this.state.dadosApp;
        let botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>
        let botaoAvancar = () => <Button title="Avançar" onPress={this.confirmar} ></Button>
        
        let botoesTela = [ { element: botaoVoltar }, { element: botaoAvancar } ];

        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Endereço' />
                <AreaDados dadosApp={dadosApp}/>
                <AreaBotoes botoes={botoesTela} />
            </View>
        );
    }
}

export class AreaDados extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let oDadosApp = this.props.dadosApp;
        let oDadosCliente = oDadosApp.cliente;

        return (
            <ScrollView>
                <ThemeProvider theme={theme}>
                    <View style={styles.areaDadosCliente}>
                        <Input placeholder="Informe sua Rua" label="Rua" value={oDadosCliente.rua} onChangeText={(valor) => { oDadosCliente.rua = valor; this.setState(this.props)}}></Input>
                        <Input placeholder="Informe seu Número" label="Número" value={oDadosCliente.numero} onChangeText={(valor) => { oDadosCliente.numero = valor; this.setState(this.props)}}></Input>
                        <Input placeholder="Informe seu Complemento" label="Complemento" value={oDadosCliente.complemento} onChangeText={(valor) => { oDadosCliente.complemento = valor; this.setState(this.props)}}></Input>
                        <Input placeholder="Informe seu Bairro" label="Bairro" value={oDadosCliente.bairro} onChangeText={(valor) => { oDadosCliente.bairro = valor; this.setState(this.props)}}></Input>                
                        <Input placeholder="Informe seu Cep" label="Cep" value={oDadosCliente.cep} onChangeText={(valor) => { oDadosCliente.cep = valor; this.setState(this.props)}}></Input>
                        <Input placeholder="Informe sua Cidade" label="Cidade" value={oDadosCliente.cidade} onChangeText={(valor) => { oDadosCliente.cidade = valor; this.setState(this.props)}}></Input>
                        <Input placeholder="Informe seu Estado" label="Estado" value={oDadosCliente.uf} onChangeText={(valor) => { oDadosCliente.uf = valor; this.setState(this.props)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>
        );
    }
}