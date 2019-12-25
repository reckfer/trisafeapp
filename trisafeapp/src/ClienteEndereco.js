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
import Util from './Util';
import Cabecalho from './common/CabecalhoTela';
import { styles, theme } from './common/Estilos';
import AreaBotoes from './common/AreaBotoes';

export default class ClienteEndereco extends Component {
    static navigationOptions = {
        title: 'ClienteEndereco'
    }
    constructor(props) {
        super(props);
        this.state = { 
            'nomeCliente': '', 
            'cpf': '', 
            'rg': '', 
            'email': '', 
            'nomeUsuario': '',
            'telefone': '',
            'cidade': '',
            'rua': '',
            'numero': '',
            'complemento': '',
            'bairro': '',
            'cep': '',
            'uf': ''
        };
        this.limpar = this.limpar.bind(this);
        this.confirmar = this.confirmar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        objUtil = new Util();
    }

    tratarRetornoJson(oJsonResposta) {
    
        Alert.alert(oJsonResposta.mensagem);
        if(oJsonResposta && !oJsonResposta.ok) {
            
            return null;
        }
        return oJsonResposta;
    }

    atribuirDadosCliente(oJsonDados) {
        this.limpar();
        if(oJsonDados && oJsonDados.dados) {
            let estado = this.state;

            estado.cidade = oJsonDados.dados.cidade;
            estado.rua = oJsonDados.dados.rua;            
            estado.numero = oJsonDados.dados.numero;
            estado.complemento = oJsonDados.dados.complemento;
            estado.bairro = oJsonDados.dados.bairro;
            estado.uf = oJsonDados.dados.uf;
            estado.cep = oJsonDados.dados.cep;
            
            this.setState(estado);
        } else if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
            Alert.alert(oJsonDados.mensagem);
        } else {
            Alert.alert('Cadastrado não localizado.');
        }
    }

    limpar() {
        let estado = this.state;

        estado.cidade = '';
        estado.rua = '';
        estado.numero = '';
        estado.complemento = '';
        estado.bairro = '';
        estado.cep = '';
        estado.uf = '';
        this.setState(estado);
    }

    confirmar() {
        const { navigation } = this.props;
        
        // if(this.validarDadosPessoais()) {
            this.state.emCadastro = false;
            navigation.navigate('ClienteConfirmacao', this.state);
        // }
    }

    capturarDadosCadastro(oDadosCadastro) {
        let estado = this.state;
    
        estado.cidade = oDadosCadastro.cidade;
        estado.rua = oDadosCadastro.rua;
        estado.numero = oDadosCadastro.numero;
        estado.complemento = oDadosCadastro.complemento;
        estado.bairro = oDadosCadastro.bairro;
        estado.cep = oDadosCadastro.cep;
        estado.uf = oDadosCadastro.uf;
        estado.emCadastro = true;

        this.setState(estado);
    }

    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteDadosPessoais', this.state);
    }

    render() {
        let dadosCliente = this.state;
        const { navigation } = this.props;
        let botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>
        let botaoAvancar = () => <Button title="Avançar" onPress={this.confirmar} ></Button>
        
        let botoesTela = [ { element: botaoVoltar }, { element: botaoAvancar } ];
        
        if(!dadosCliente.emCadastro) {
            // Obtem os dados vindos da tela dados pessoais.
            dadosCliente.codigo = navigation.getParam('codigo', '');
            dadosCliente.nomeCliente = navigation.getParam('nomeCliente', '');           
            dadosCliente.nomeUsuario = navigation.getParam('nomeUsuario', '');
            dadosCliente.cpf = navigation.getParam('cpf', '');
            dadosCliente.rg = navigation.getParam('rg', '');
            dadosCliente.email = navigation.getParam('email', '');
            dadosCliente.telefone = navigation.getParam('telefone', '');
        }
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Endereço' />
                <AreaDados capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
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
                        <Input placeholder="Informe sua Rua" label="Rua" value={this.props.dadosCliente.rua} onChangeText={(valor) => { this.props.dadosCliente.rua = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu Número" label="Número" value={this.props.dadosCliente.numero} onChangeText={(valor) => { this.props.dadosCliente.numero = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu Complemento" label="Complemento" value={this.props.dadosCliente.complemento} onChangeText={(valor) => { this.props.dadosCliente.complemento = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu Bairro" label="Bairro" value={this.props.dadosCliente.bairro} onChangeText={(valor) => { this.props.dadosCliente.bairro = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>                
                        <Input placeholder="Informe seu Cep" label="Cep" value={this.props.dadosCliente.cep} onChangeText={(valor) => { this.props.dadosCliente.cep = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe sua Cidade" label="Cidade" value={this.props.dadosCliente.cidade} onChangeText={(valor) => { this.props.dadosCliente.cidade = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu Estado" label="Estado" value={this.props.dadosCliente.uf} onChangeText={(valor) => { this.props.dadosCliente.uf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>
        );
    }
}