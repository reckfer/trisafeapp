/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
    View,
    Image,
    Text,
    TextInput,
    Button
} from 'react-native';
import Util from './Util';

export default class ClienteInicio extends Component {
    static navigationOptions = {
        title: 'ClienteInicio'
    }
    constructor(props) {
        super(props);
        this.state = { 'cpf': '', 'email': '', 'nomeUsuario': '' };
        this.limpar = this.limpar.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        this.obterCliente = this.obterCliente.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
        objUtil = new Util();
    }

    capturarDadosCadastro(oDadosCadastro) {
        let estado = this.state;
    
        estado.cpf = oDadosCadastro.cpf;
        estado.nomeUsuario = oDadosCadastro.nomeUsuario;
        estado.email = oDadosCadastro.email;
        
        this.setState(estado);
    }

    obterCliente() {
        try {
            let estado = this.state;
            let url = objUtil.getURL('/clientes/obter/');
            
            //fetch(url, { method: 'GET' })
            fetch(url, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  cpf: estado.cpf,
                  nomeUsuario: estado.nomeUsuario,
                  email: estado.email
                }),
              })
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

    atribuirDadosCliente(oJsonDados) {
        const { navigation } = this.props;
        //this.limpar();
        if(oJsonDados && oJsonDados.user) {
            
            // let estado = this.state;

            // estado.codigo = oJsonDados.user.id.toString();
            // estado.nomeCliente = oJsonDados.user.name;            
            // estado.nomeUsuario = oJsonDados.user.userName;
            // estado.cpf = oJsonDados.user.document;
            // estado.email = oJsonDados.user.email;
            
            //this.setState(estado);
            
            navigation.navigate('Cliente', oJsonDados.user);

        } else if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
            Alert.alert(oJsonDados.mensagem);
        } else {
            navigation.navigate('Cliente', this.state);
            //Alert.alert('Cadastrado não localizado.');
        }
    }

    limpar() {
        let estado = this.state;

        estado.nomeUsuario = '';
        estado.cpf = '';
        estado.email = '';
        this.setState(estado);
    }
    
    render() {
        let dadosCliente = this.state;
        return (
            <View style={styles.areaCliente}>
                <Cabecalho />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
                <AreaBotoes limpar={this.limpar} navigation = {this.props.navigation} obterCliente={this.obterCliente} dadosCliente={dadosCliente}/>
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
                <TextInput placeholder="E-mail" style={styles.textInput} onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
                <TextInput placeholder="CPF/ CNPJ" style={styles.textInput} onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>                
                <TextInput placeholder="Nome Usuário" style={styles.textInput} onChangeText={(valor) => { this.props.dadosCliente.nomeUsuario = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
            </View>
        );
    }
}

export class AreaBotoes extends Component {
    
    static navigationOptions = {
        title: 'ClienteInicio'
    }

    constructor(props) {
        super(props);
    }

    render() {
        // const { navigation } = this.props;
        return (
            <View>
                <Button title="Iniciar" onPress={this.props.obterCliente} ></Button>
                {/* <Button title="Iniciar" onPress={() => {navigation.navigate('Cliente', {
                    nomeUsuario: this.props.dadosCliente.nomeUsuario,
                    cpf: this.props.dadosCliente.cpf,
                    email: this.props.dadosCliente.email
                })}} ></Button> */}
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