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
    View
} from 'react-native';
import Util from './common/Util';
import { ThemeProvider, Input, Button } from 'react-native-elements';
import Cabecalho from './common/CabecalhoTela';
import { styles, theme } from './common/Estilos';
import AreaBotoes from './common/AreaBotoes';
import GerenciadorDadosApp from './common/GerenciadorDadosApp';

export default class ClienteConfirmacao extends Component {
    static navigationOptions = {
        title: 'ClienteConfirmacao'
    }
    constructor(props) {
        super(props);
        let oNavigation = this.props.navigation;
        this.salvar = this.salvar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.tratarDadosRetorno = this.tratarDadosRetorno.bind(this);
        
        oUtil = new Util();
        oGerenciadorDadosApp = new GerenciadorDadosApp(oNavigation);

        this.state = oGerenciadorDadosApp.getDadosAppGeral();
    }

    salvar() {
        try {
            let url = oUtil.getURL('/clientes/incluir/');
            let oDadosAppGeral = this.state;
            
            oDadosAppGeral.processandoRequisicao = true;
            this.setState(oDadosAppGeral);

            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(oDadosAppGeral)
                  })
                  .then(oUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      oUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosRetorno);
                  })
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    tratarDadosRetorno(oDados) {
        let oDadosAppGeral = this.state;

        oDadosAppGeral.processandoRequisicao = false;
        this.setState(oDadosAppGeral);

        if(oDados && oDados.id_cliente_iter) {
            Alert.alert("Cod. cliente Iter: " + oDados.id_cliente_iter);
        }
    }
     
    voltar() {
        const { navigation } = this.props;
        let telaDestino = 'ClienteEndereco';

        if(navigation.getParam('emTestes')) {
            telaDestino = 'TestesInicio';
        }
        navigation.navigate(telaDestino, this.state);
    }

    botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>;        
    botaoConfirmar = () => <Button title="Confirmar" onPress={this.salvar} loading={this.state.processandoRequisicao} ></Button>;

    render() {
        let dadosApp = this.state.dados_app;
        let botoesTela = [ { element: this.botaoVoltar }, { element: this.botaoConfirmar } ];

        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Confirmação' />
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
                        <Input label="Nome Completo" disabled={true} style={styles.Input} value={oDadosCliente.nome} onChangeText={(valor) => { oDadosCliente.nome = valor; this.setState(this.props)}}></Input>                
                        <Input label="E-mail" disabled={true} style={styles.Input} value={oDadosCliente.email} onChangeText={(valor) => { oDadosCliente.email = valor; this.setState(this.props)}}></Input>
                        <Input label="CPF" disabled={true} style={styles.Input} value={oDadosCliente.cpf} onChangeText={(valor) => { oDadosCliente.cpf = valor; this.setState(this.props)}}></Input>
                        <Input label="RG" disabled={true} style={styles.Input} value={oDadosCliente.rg} onChangeText={(valor) => { oDadosCliente.rg = valor; this.setState(this.props)}}></Input>                
                        <Input label="Telefone" disabled={true} style={styles.Input} value={oDadosCliente.telefone} onChangeText={(valor) => { oDadosCliente.telefone = valor; this.setState(this.props)}}></Input>
                        <Input label="Nome Usuário" disabled={true} style={styles.Input} value={oDadosCliente.nomeUsuario} onChangeText={(valor) => { oDadosCliente.nomeUsuario = valor; this.setState(this.props)}}></Input>
                        <Input label="Rua" disabled={true} style={styles.Input} value={oDadosCliente.rua} onChangeText={(valor) => { oDadosCliente.rua = valor; this.setState(this.props)}}></Input>
                        <Input label="Número" disabled={true} style={styles.Input} value={oDadosCliente.numero} onChangeText={(valor) => { oDadosCliente.numero = valor; this.setState(this.props)}}></Input>
                        <Input label="Complemento" disabled={true} style={styles.Input} value={oDadosCliente.complemento} onChangeText={(valor) => { oDadosCliente.complemento = valor; this.setState(this.props)}}></Input>
                        <Input label="Bairro" disabled={true} style={styles.Input} value={oDadosCliente.bairro} onChangeText={(valor) => { oDadosCliente.bairro = valor; this.setState(this.props)}}></Input>                
                        <Input label="Cep" disabled={true} style={styles.Input} value={oDadosCliente.cep} onChangeText={(valor) => { oDadosCliente.cep = valor; this.setState(this.props)}}></Input>
                        <Input label="Cidade" disabled={true} style={styles.Input} value={oDadosCliente.cidade} onChangeText={(valor) => { oDadosCliente.cidade = valor; this.setState(this.props)}}></Input>
                        <Input label="Estado" disabled={true} style={styles.Input} value={oDadosCliente.uf} onChangeText={(valor) => { oDadosCliente.uf = valor; this.setState(this.props)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>       
        );
    }
}