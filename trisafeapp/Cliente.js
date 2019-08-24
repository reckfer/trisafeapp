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

export default class Cliente extends Component {

    constructor(props) {
        super(props);
        this.state = { 'codigo': '', 'nome': '', 'cpf': '', 'rg': '', 'email': '' };
        this.obterCliente = this.obterCliente.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
        this.capturarDadosFiltroCallBack = this.capturarDadosFiltroCallBack.bind(this);
    }

    obterCliente() {
        try {
            let protocol = 'https://';
            let domain = 'trisafeserverappd.herokuapp.com';

            if (__DEV__) {
                protocol = 'http://';
                domain = '192.168.0.5:8000';
            }
            let estado = this.state;
            let url = protocol + domain + '/clientes/obter?idCliente=' + estado.codigo;

            fetch(url, { method: 'GET' })
                .then(tratarRespostaHTTP)
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
        if(oJsonDados && oJsonDados.user) {
            let estado = this.state;

            estado.nome = oJsonDados.user.name;
            estado.cpf = oJsonDados.user.document;
            estado.email = oJsonDados.user.email;
            this.setState(estado);
        } else {
            Alert.alert('Cadastrado não localizado.');
        }
    }

    capturarDadosFiltroCallBack(oDadosFiltro) {
        let estado = this.state;
        
        estado.codigo = oDadosFiltro.codigo;
        this.setState(estado);
    }

    render() {
        let dadosCliente = this.state;
        return (
            <View style={styles.areaCliente}>
                <Cabecalho />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} dadosCliente={dadosCliente}/>
                <AreaBotoes obterCliente={this.obterCliente}/>
            </View>
        );
    }
}

export class Cabecalho extends Component {
    render() {
        let caminhoImagem = './multimidia/tri-logo-01.png';
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
                <TextInput placeholder="Nome Completo" style={styles.textInput} value={this.props.dadosCliente.nome}></TextInput>
                <TextInput placeholder="CPF/ CNPJ" style={styles.textInput} value={this.props.dadosCliente.cpf}></TextInput>
                <TextInput placeholder="RG" style={styles.textInput} value={this.props.dadosCliente.rg}></TextInput>
                <TextInput placeholder="E-mail" style={styles.textInput} value={this.props.dadosCliente.email}></TextInput>
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
                <Button title="Pronto" onPress={this.props.obterCliente} color="#4682b4" ></Button>
            </View>
        );
    }
}
function tratarRespostaHTTP(oRespostaHTTP) {
    if (oRespostaHTTP.ok) {
        return oRespostaHTTP.json();
    } else {
        Alert.alert("Erro: " + oRespostaHTTP.status);
    }
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