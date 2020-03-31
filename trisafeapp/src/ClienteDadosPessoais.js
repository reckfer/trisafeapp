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
import Util from './common/Util';
import { ThemeProvider, Input, Button } from 'react-native-elements';
import Cabecalho from './common/CabecalhoTela';
import { styles, theme } from './common/Estilos';
import AreaBotoes from './common/AreaBotoes';
import GerenciadorDadosApp from './common/GerenciadorDadosApp';

export default class ClienteDadosPessoais extends Component {
    static navigationOptions = {
        title: 'ClienteDadosPessoais'
    }
    constructor(props) {
        super(props);
        let oNavigation = this.props.navigation;
        this.limpar = this.limpar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.confirmar = this.confirmar.bind(this);
        // this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        
        oUtil = new Util();
        oGerenciadorDadosApp = new GerenciadorDadosApp(oNavigation);

        this.state = oGerenciadorDadosApp.getDadosAppGeral();
    }

    tratarRetornoJson(oJsonResposta) {
    
        Alert.alert(oJsonResposta.mensagem);
        if(oJsonResposta && !oJsonResposta.ok) {
            
            return null;
        }
        return oJsonResposta;
    }

    limpar() {
        let oDadosAppGeral = this.state;

        oDadosAppGeral.cliente.codigo = '';
        oDadosAppGeral.cliente.nomeCliente = '';
        oDadosAppGeral.cliente.nomeUsuario = '';
        oDadosAppGeral.cliente.cpf = '';
        oDadosAppGeral.cliente.rg = '';
        oDadosAppGeral.cliente.email = '';
        oDadosAppGeral.cliente.telefone = '';
        this.setState(oDadosAppGeral);
    }

    confirmar() {
        const { navigation } = this.props;
        
        // if(this.validarDadosPessoais()) {
            this.state.emCadastro = false;
            navigation.navigate('ClienteEndereco', this.state);
        // }
    }

    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteInicio', this.state);
    }
    
    render() {
        let dadosApp = this.state.dadosApp;
        // const { navigation } = this.props;        
        let botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>
        let botaoAvancar = () => <Button title="Avançar" onPress={this.confirmar} ></Button>
        
        let botoesTela = [ { element: botaoVoltar }, { element: botaoAvancar } ];

        // if(!this.state.emCadastro) {
        //     // Obtem os dados vindos da primeira tela.
        //     oUtil.lerDadosNavegacao(dadosCliente, navigation);
        // }
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Meus dados' />
                <AreaDados dadosApp={dadosApp}/>
                <AreaBotoes botoes={botoesTela}/>
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
                        <Input placeholder="Informe seu Nome Completo" label="Nome Completo" value={oDadosCliente.nome} onChangeText={(valor) => { oDadosCliente.nome = valor; this.setState(this.props);}}></Input>
                        <Input placeholder="Informe seu E-Mail" label="E-mail" value={oDadosCliente.email} onChangeText={(valor) => {oDadosCliente.email = valor; this.setState(this.props);}}></Input>
                        <Input placeholder="Informe seu CPF" label="CPF" value={oDadosCliente.cpf} onChangeText={(valor) => { oDadosCliente.cpf = valor; this.setState(this.props);}}></Input>
                        <Input placeholder="Informe seu RG" label="RG" value={oDadosCliente.rg} onChangeText={(valor) => { oDadosCliente.rg = valor; this.setState(this.props);}}></Input>                
                        <Input placeholder="Informe seu Telefone" label="Telefone" value={oDadosCliente.telefone} onChangeText={(valor) => { oDadosCliente.telefone = valor; this.setState(this.props);}}></Input>
                        <Input placeholder="Informe seu Nome de Usuário" label="Nome de Usuário" value={oDadosCliente.nomeUsuario} onChangeText={(valor) => { oDadosCliente.nomeUsuario = valor; this.setState(this.props);}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>
        );
    }
}