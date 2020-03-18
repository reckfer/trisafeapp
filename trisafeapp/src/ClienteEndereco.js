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

export default class ClienteEndereco extends Component {
    static navigationOptions = {
        title: 'ClienteEndereco'
    }
    constructor(props) {
        super(props);
        this.limpar = this.limpar.bind(this);
        this.confirmar = this.confirmar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
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

    atribuirDadosCliente(oJsonDados) {
        this.limpar();
        if(oJsonDados && oJsonDados.dados) {
            let estado = this.state;

            estado.cliente.cidade = oJsonDados.dados.cidade;
            estado.cliente.rua = oJsonDados.dados.rua;            
            estado.cliente.numero = oJsonDados.dados.numero;
            estado.cliente.complemento = oJsonDados.dados.complemento;
            estado.cliente.bairro = oJsonDados.dados.bairro;
            estado.cliente.uf = oJsonDados.dados.uf;
            estado.cliente.cep = oJsonDados.dados.cep;
            
            this.setState(estado);
        } else if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
            Alert.alert(oJsonDados.mensagem);
        } else {
            Alert.alert('Cadastrado não localizado.');
        }
    }

    limpar() {
        let estado = this.state;

        estado.cliente.cidade = '';
        estado.cliente.rua = '';
        estado.cliente.numero = '';
        estado.cliente.complemento = '';
        estado.cliente.bairro = '';
        estado.cliente.cep = '';
        estado.cliente.uf = '';
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
    
        estado.cliente.cidade = oDadosCadastro.cidade;
        estado.cliente.rua = oDadosCadastro.rua;
        estado.cliente.numero = oDadosCadastro.numero;
        estado.cliente.complemento = oDadosCadastro.complemento;
        estado.cliente.bairro = oDadosCadastro.bairro;
        estado.cliente.cep = oDadosCadastro.cep;
        estado.cliente.uf = oDadosCadastro.uf;
        estado.emCadastro = true;

        this.setState(estado);
    }

    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteDadosPessoais', this.state);
    }

    render() {
        let dadosCliente = this.state.cliente;
        const { navigation } = this.props;
        let botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>
        let botaoAvancar = () => <Button title="Avançar" onPress={this.confirmar} ></Button>
        
        let botoesTela = [ { element: botaoVoltar }, { element: botaoAvancar } ];
        
        if(!this.state.emCadastro) {
            // Obtem os dados vindos da tela dados pessoais.
            objUtil.lerDadosNavegacao(dadosCliente, navigation);
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