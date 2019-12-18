/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Alert,
    View,
    Image,
    Text,
    TextInput,
    Button,
    NavigationActions
} from 'react-native';
import Util from './Util';

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
            <ScrollView>
                <View style={styles.areaCliente}>
                    <Cabecalho />
                    <AreaDados capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
                    <AreaBotoes confirmar={this.confirmar} voltar={this.voltar}/>
                </View>
            </ScrollView>
        );
    }
}

export class Cabecalho extends Component {
    render() {
        let caminhoImagem = '../multimidia/tri-logo-01.png';
        return (
            <View style={styles.areaCabecalho}>
                <Image source={require(caminhoImagem)} />
                <Titulo titulo='Meus dados' />
            </View>
        );
    }
}

export class Titulo extends Component {
    render() {
        return (
            <View style={styles.areaTitulo}>
                <Text style={styles.textoTitulo}>{this.props.titulo}</Text>
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
            <View style={styles.areaDadosCliente}>
                <TextInput placeholder="Cidade" style={styles.textInput} value={this.props.dadosCliente.cidade} onChangeText={(valor) => { this.props.dadosCliente.cidade = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="Rua" style={styles.textInput} value={this.props.dadosCliente.rua} onChangeText={(valor) => { this.props.dadosCliente.rua = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="Número" style={styles.textInput} value={this.props.dadosCliente.numero} onChangeText={(valor) => { this.props.dadosCliente.numero = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="Complemento" style={styles.textInput} value={this.props.dadosCliente.complemento} onChangeText={(valor) => { this.props.dadosCliente.complemento = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="Bairro" style={styles.textInput} value={this.props.dadosCliente.bairro} onChangeText={(valor) => { this.props.dadosCliente.bairro = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>                
                <TextInput placeholder="Cep" style={styles.textInput} value={this.props.dadosCliente.cep} onChangeText={(valor) => { this.props.dadosCliente.cep = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="Estado" style={styles.textInput} value={this.props.dadosCliente.uf} onChangeText={(valor) => { this.props.dadosCliente.uf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
            </View>
        );
    }
}

export class AreaBotoes extends Component {
    
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <Button title="Confirmar" onPress={this.props.confirmar} color="#4682b4" ></Button>
                <Button title="Voltar" onPress={this.props.voltar} color="#4682b4" ></Button>
            </View>
        );
    }
}
function obterJsonResposta(oRespostaHTTP) {
    
    if(oRespostaHTTP) {
        return oRespostaHTTP.json();        
    }
    return null;
}

const styles = StyleSheet.create({
    areaCliente: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#f5f5f5'
    },
    areaDadosCliente: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'stretch'
    },
    areaCabecalho: {
        backgroundColor: '#f5f5f5',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10
    },
    areaTitulo: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    textoTitulo: {
        fontSize: 28,
        fontWeight: '300',
        color: '#000000',
        textAlign: 'center',
    },
    textInput: {
        borderColor: '#add8e6',
        borderWidth: 1,
        borderRadius: 7,
        margin: 5,
        backgroundColor: '#fffafa',
        alignSelf: 'stretch'
    }
});