/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Alert,
    View,
    Image,
    Text,
    Console,
    StatusBar,
    TextInput,
    Button
} from 'react-native';
import Util from './Util';

export default class Cliente extends Component {

    constructor(props) {
        super(props);
        this.state = { 'codigo': '', 'nomeCliente': '', 'cpf': '', 'rg': '', 'email': '', 'nomeUsuario': '' };
        this.limpar = this.limpar.bind(this);
        this.salvar = this.salvar.bind(this);
        this.obterCliente = this.obterCliente.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        this.capturarDadosFiltroCallBack = this.capturarDadosFiltroCallBack.bind(this);
        objUtil = new Util();
    }

    obterCliente() {
        try {
            // let protocol = 'https://';
            // let domain = 'trisafeserverappd.herokuapp.com';

            // if (__DEV__) {
            //     protocol = 'http://';
            //     domain = '10.0.0.106:8000';
            //     //domain = '192.168.0.6:8000';
            //     //domain = '192.168.0.4:8000';
            // }
            
            // let url = protocol + domain + '/clientes/obter?idCliente=' + estado.codigo;
            let estado = this.state;
            let url = objUtil.getURL('/clientes/obter?idCliente=' + estado.codigo);
            Alert.alert(url);
            fetch(url, { method: 'GET' })
                .then(obterJsonResposta)
                .then((oJsonDados) => {
                    this.atribuirDadosCliente(oJsonDados);
                })
                .catch(function (erro) {
                    Alert.alert(erro.message);
                    throw erro;
                });
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    tratarRetornoJson(oJsonResposta) {
    
        if(oJsonResposta && !oJsonResposta.ok) {
            Alert.alert(oJsonResposta.mensagem);
            return null;
        }
        return oJsonResposta;
    }

    atribuirDadosCliente(oJsonDados) {
        if(oJsonDados && oJsonDados.user) {
            let estado = this.state;

            estado.nome = oJsonDados.user.name;
            estado.cpf = oJsonDados.user.document;
            estado.email = oJsonDados.user.email;
            this.setState(estado);
        } else if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
            Alert.alert(oJsonDados.mensagem);
        } else {
            Alert.alert('Cadastrado não localizado.');
        }
    }

    salvar() {
        try {
            // let protocol = 'https://';
            // let domain = 'trisafeserverappd.herokuapp.com';

            // if (__DEV__) {
            //     protocol = 'http://';
            //     domain = '10.0.0.106:8000';
            //     // domain = '192.168.0.6:8000';
            //     //domain = '192.168.0.4:8000';
            // }
            let estado = this.state;            
            // let url = protocol + domain + '/clientes/incluir/';
            let url = objUtil.getURL('/clientes/incluir/');

            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      cpf: estado.cpf,
                      rg: estado.rg,
                      nomeCliente: estado.nomeCliente,                      
                      nomeUsuario: estado.nomeUsuario,
                      email: estado.email
                    }),
                  })
                  .then(obterJsonResposta)
                  .then((oJsonDados) => {this.tratarRetornoJson(oJsonDados)})
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    limpar() {
        let estado = this.state;

        estado.nome = '';
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
        
    capturarDadosCadastro(oDadosCadastro) {
        let estado = this.state;
    
        estado.cpf = oDadosCadastro.cpf;
        estado.nomeCliente = oDadosCadastro.nomeCliente;
        estado.nomeUsuario = oDadosCadastro.nomeUsuario;
        estado.email = oDadosCadastro.email;
        
        this.setState(estado);
    }

    render() {
        let dadosCliente = this.state;
        return (
            <View style={styles.areaCliente}>
                <Cabecalho />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
                <AreaBotoes salvar={this.salvar} obterCliente={this.obterCliente} limpar={this.limpar}/>
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
            <View style={styles.areaDadosCliente}>
                <TextInput placeholder="Código" style={styles.textInput} onChangeText={(valor) => this.props.parentCallBack({ codigo: valor })}></TextInput>
                <TextInput placeholder="Nome Completo" style={styles.textInput} value={this.props.dadosCliente.nomeCliente} onChangeText={(valor) => { this.props.dadosCliente.nomeCliente = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="Nome Usuário" style={styles.textInput} value={this.props.dadosCliente.nomeUsuario} onChangeText={(valor) => { this.props.dadosCliente.nomeUsuario = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="E-mail" style={styles.textInput} value={this.props.dadosCliente.email} onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="CPF/ CNPJ" style={styles.textInput} value={this.props.dadosCliente.cpf} onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="RG" style={styles.textInput} value={this.props.dadosCliente.rg} onChangeText={(valor) => { this.props.dadosCliente.rg = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                
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
                <Button title="Obter" onPress={this.props.obterCliente} color="#4682b4" ></Button>
                <Button title="Salvar" onPress={this.props.salvar} color="#4682b4" ></Button>
                <Button title="Limpar" onPress={this.props.limpar} color="#4682b4" ></Button>
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