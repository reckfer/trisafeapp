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

export default class ClienteConfirmacao extends Component {
    static navigationOptions = {
        title: 'ClienteConfirmacao'
    }
    constructor(props) {
        super(props);
        
        this.limpar = this.limpar.bind(this);
        this.salvar = this.salvar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.tratarDadosRetorno = this.tratarDadosRetorno.bind(this);
        this.capturarDadosFiltroCallBack = this.capturarDadosFiltroCallBack.bind(this);
        
        objUtil = new Util();
        this.state = objUtil.inicializarDados();
    }

    salvar() {
        try {
            let url = objUtil.getURL('/clientes/incluir/');
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
                  .then(objUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      objUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosRetorno);
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

    limpar() {
        let oDadosAppGeral = this.state;

        oDadosAppGeral.cliente.codigo = '';
        oDadosAppGeral.cliente.nomeCliente = '';
        oDadosAppGeral.cliente.nomeUsuario = '';
        oDadosAppGeral.cliente.cpf = '';
        oDadosAppGeral.cliente.rg = '';
        oDadosAppGeral.cliente.email = '';
        this.setState(oDadosAppGeral);
    }

    capturarDadosFiltroCallBack(oDadosFiltro) {
        let oDadosAppGeral = this.state;
        
        oDadosAppGeral.cliente.codigo = oDadosFiltro.codigo;
        this.setState(oDadosAppGeral);
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
        let dadosApp = this.state.dadosApp;
        const { navigation } = this.props;

        let botoesTela = [ { element: this.botaoVoltar }, { element: this.botaoConfirmar } ];

        // Obtem os dados vindos da tela dados pessoais.
        objUtil.lerDadosNavegacao(dadosCliente, navigation);
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Confirmação' />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} dadosApp={dadosApp}/>
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

        return (
            <ScrollView>
                <ThemeProvider theme={theme}>
                    <View style={styles.areaDadosCliente}>
                        <Input label="Nome Completo" disabled={true} style={styles.Input} value={this.props.dadosCliente.nome} onChangeText={(valor) => { this.props.dadosCliente.nome = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>                
                        <Input label="E-mail" disabled={true} style={styles.Input} value={this.props.dadosCliente.email} onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="CPF" disabled={true} style={styles.Input} value={this.props.dadosCliente.cpf} onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="RG" disabled={true} style={styles.Input} value={this.props.dadosCliente.rg} onChangeText={(valor) => { this.props.dadosCliente.rg = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>                
                        <Input label="Telefone" disabled={true} style={styles.Input} value={this.props.dadosCliente.telefone} onChangeText={(valor) => { this.props.dadosCliente.telefone = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="Nome Usuário" disabled={true} style={styles.Input} value={this.props.dadosCliente.nomeUsuario} onChangeText={(valor) => { this.props.dadosCliente.nomeUsuario = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="Rua" disabled={true} style={styles.Input} value={this.props.dadosCliente.rua} onChangeText={(valor) => { this.props.dadosCliente.rua = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="Número" disabled={true} style={styles.Input} value={this.props.dadosCliente.numero} onChangeText={(valor) => { this.props.dadosCliente.numero = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="Complemento" disabled={true} style={styles.Input} value={this.props.dadosCliente.complemento} onChangeText={(valor) => { this.props.dadosCliente.complemento = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="Bairro" disabled={true} style={styles.Input} value={this.props.dadosCliente.bairro} onChangeText={(valor) => { this.props.dadosCliente.bairro = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>                
                        <Input label="Cep" disabled={true} style={styles.Input} value={this.props.dadosCliente.cep} onChangeText={(valor) => { this.props.dadosCliente.cep = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="Cidade" disabled={true} style={styles.Input} value={this.props.dadosCliente.cidade} onChangeText={(valor) => { this.props.dadosCliente.cidade = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input label="Estado" disabled={true} style={styles.Input} value={this.props.dadosCliente.uf} onChangeText={(valor) => { this.props.dadosCliente.uf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>       
        );
    }
}