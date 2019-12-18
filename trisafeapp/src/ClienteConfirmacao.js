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
    Button
} from 'react-native';
import Util from './Util';

export default class ClienteSenha extends Component {
    static navigationOptions = {
        title: 'ClienteSenha'
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
            'uf': '',
            'senha': '',
            'senhaConfirmacao': '',
            'codigo': ''
        };
        this.limpar = this.limpar.bind(this);
        this.salvar = this.salvar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
        this.capturarDadosFiltroCallBack = this.capturarDadosFiltroCallBack.bind(this);
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

            estado.nomeCliente = oJsonDados.dados.nomeCliente;
            estado.nomeUsuario = oJsonDados.dados.nomeUsuario;
            estado.cpf = oJsonDados.dados.cpf;
            estado.rg = oJsonDados.dados.rg;
            estado.email = oJsonDados.dados.email;
            estado.telefone = oJsonDados.dados.telefone;
            estado.senha = oJsonDados.dados.senha;
            estado.senhaConfirmacao = oJsonDados.dados.senhaConfirmacao;
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

    salvar() {
        try {
            let estado = this.state;            
            let url = objUtil.getURL('/clientes/incluir/');

            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(estado)
                  })
                  .then(obterJsonResposta)
                  .then((oJsonDados) => {this.atribuirDadosCliente(oJsonDados)})
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    limpar() {
        let estado = this.state;

        estado.codigo = '';
        estado.nomeCliente = '';
        estado.nomeUsuario = '';
        estado.cpf = '';
        estado.rg = '';
        estado.email = '';
        this.setState(estado);
    }

    capturarDadosFiltroCallBack(oDadosFiltro) {
        let estado = this.state;
        
        estado.codigo = oDadosFiltro.codigo;
        this.setState(estado);
    }
     
    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteEndereco', this.state);
    }

    render() {
        let dadosCliente = this.state;
        const { navigation } = this.props;        
        
        // Obtem os dados vindos da tela dados pessoais.
        dadosCliente.nomeCliente = navigation.getParam('nomeCliente', '');           
        dadosCliente.nomeUsuario = navigation.getParam('nomeUsuario', '');
        dadosCliente.cpf = navigation.getParam('cpf', '');
        dadosCliente.rg = navigation.getParam('rg', '');
        dadosCliente.email = navigation.getParam('email', '');
        dadosCliente.telefone = navigation.getParam('telefone', '');
        dadosCliente.cidade = navigation.getParam('cidade', '');
        dadosCliente.rua = navigation.getParam('rua', '');
        dadosCliente.numero = navigation.getParam('numero', '');
        dadosCliente.complemento = navigation.getParam('complemento', '');
        dadosCliente.bairro = navigation.getParam('bairro', '');
        dadosCliente.cep = navigation.getParam('cep', '');
        dadosCliente.uf = navigation.getParam('uf', '');
        // dadosCliente.senha = navigation.getParam('senha', '');
        // dadosCliente.senhaConfirmacao = navigation.getParam('senhaConfirmacao', '');
                
        return (
            <View style={styles.areaCliente}>
                <Cabecalho />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} dadosCliente={dadosCliente}/>
                <AreaBotoes salvar={this.salvar} voltar={this.voltar}/>
            </View>
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
            <ScrollView>
                <View style={styles.areaDadosCliente}>
                    <TextInput placeholder="Nome Completo" style={styles.textInput} value={this.props.dadosCliente.nomeCliente} onChangeText={(valor) => { this.props.dadosCliente.nomeCliente = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>                
                    <TextInput placeholder="CPF" style={styles.textInput} value={this.props.dadosCliente.cpf} onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="RG" style={styles.textInput} value={this.props.dadosCliente.rg} onChangeText={(valor) => { this.props.dadosCliente.rg = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>                
                    <TextInput placeholder="E-mail" style={styles.textInput} value={this.props.dadosCliente.email} onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="Telefone" style={styles.textInput} value={this.props.dadosCliente.telefone} onChangeText={(valor) => { this.props.dadosCliente.telefone = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="Nome Usuário" style={styles.textInput} value={this.props.dadosCliente.nomeUsuario} onChangeText={(valor) => { this.props.dadosCliente.nomeUsuario = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>               
                    <TextInput placeholder="Cidade" style={styles.textInput} value={this.props.dadosCliente.cidade} onChangeText={(valor) => { this.props.dadosCliente.cidade = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="Rua" style={styles.textInput} value={this.props.dadosCliente.rua} onChangeText={(valor) => { this.props.dadosCliente.rua = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="Número" style={styles.textInput} value={this.props.dadosCliente.numero} onChangeText={(valor) => { this.props.dadosCliente.numero = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="Complemento" style={styles.textInput} value={this.props.dadosCliente.complemento} onChangeText={(valor) => { this.props.dadosCliente.complemento = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="Bairro" style={styles.textInput} value={this.props.dadosCliente.bairro} onChangeText={(valor) => { this.props.dadosCliente.bairro = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>                
                    <TextInput placeholder="Cep" style={styles.textInput} value={this.props.dadosCliente.cep} onChangeText={(valor) => { this.props.dadosCliente.cep = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                    <TextInput placeholder="Estado" style={styles.textInput} value={this.props.dadosCliente.uf} onChangeText={(valor) => { this.props.dadosCliente.uf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                </View>
            </ScrollView>       
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
                <Button title="Confirmar" onPress={this.props.salvar} color="#4682b4" ></Button>
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