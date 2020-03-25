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

export default class ClienteDadosPessoais extends Component {
    static navigationOptions = {
        title: 'ClienteDadosPessoais'
    }
    constructor(props) {
        super(props);
        this.limpar = this.limpar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.confirmar = this.confirmar.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        
        objUtil = new Util();
        this.state = objUtil.inicializarDados();
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
        
    capturarDadosCadastro(oDadosCadastro) {
        let oDadosAppGeral = this.state;
    
        oDadosAppGeral.cliente.cpf = oDadosCadastro.cpf;
        oDadosAppGeral.cliente.rg = oDadosCadastro.rg;
        oDadosAppGeral.cliente.nome = oDadosCadastro.nome;
        oDadosAppGeral.cliente.nomeUsuario = oDadosCadastro.nomeUsuario;
        oDadosAppGeral.cliente.email = oDadosCadastro.email;
        oDadosAppGeral.cliente.telefone = oDadosCadastro.telefone;
        oDadosAppGeral.emCadastro = true;
        
        this.setState(oDadosAppGeral);
    }

    render() {
        let dadosApp = this.state.dadosApp;
        const { navigation } = this.props;        
        let botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>
        let botaoAvancar = () => <Button title="Avançar" onPress={this.confirmar} ></Button>
        
        let botoesTela = [ { element: botaoVoltar }, { element: botaoAvancar } ];

        if(!this.state.emCadastro) {
            // Obtem os dados vindos da primeira tela.
            objUtil.lerDadosNavegacao(dadosCliente, navigation);
        }
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Meus dados' />
                <AreaDados capturarDadosCallBack={this.capturarDadosCadastro} dadosApp={dadosApp}/>
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

        return (
            <ScrollView>
                <ThemeProvider theme={theme}>
                    <View style={styles.areaDadosCliente}>
                        <Input placeholder="Informe seu Nome Completo" label="Nome Completo" value={this.props.dadosCliente.nome} onChangeText={(valor) => { this.props.dadosCliente.nome = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu E-Mail" label="E-mail" onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}>{this.props.dadosCliente.email}</Input>
                        <Input placeholder="Informe seu CPF" label="CPF" value={this.props.dadosCliente.cpf} onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu RG" label="RG" value={this.props.dadosCliente.rg} onChangeText={(valor) => { this.props.dadosCliente.rg = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>                
                        <Input placeholder="Informe seu Telefone" label="Telefone" value={this.props.dadosCliente.telefone} onChangeText={(valor) => { this.props.dadosCliente.telefone = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu Nome de Usuário" label="Nome de Usuário" value={this.props.dadosCliente.nomeUsuario} onChangeText={(valor) => { this.props.dadosCliente.nomeUsuario = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>
        );
    }
}