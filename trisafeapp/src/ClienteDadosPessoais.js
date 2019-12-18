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

export default class ClienteDadosPessoais extends Component {
    static navigationOptions = {
        title: 'ClienteDadosPessoais'
    }
    constructor(props) {
        super(props);
        this.state = { 
            'codigo': '', 
            'nomeCliente': '', 
            'cpf': '', 
            'rg': '', 
            'email': '', 
            'nomeUsuario': '',
            'telefone': ''
        };
        this.limpar = this.limpar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.confirmar = this.confirmar.bind(this);
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

            estado.codigo = oJsonDados.dados.id.toString();
            estado.nomeCliente = oJsonDados.dados.name;            
            estado.nomeUsuario = oJsonDados.dados.dadosName;
            estado.cpf = oJsonDados.dados.document;
            estado.email = oJsonDados.dados.email;
            estado.telefone = oJsonDados.dados.telefone;
            
            this.setState(estado);
        } else if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
            Alert.alert(oJsonDados.mensagem);
        } else {
            Alert.alert('Cadastrado não localizado.');
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
        estado.telefone = '';
        this.setState(estado);
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
        let estado = this.state;
    
        estado.cpf = oDadosCadastro.cpf;
        estado.rg = oDadosCadastro.rg;
        estado.nomeCliente = oDadosCadastro.nomeCliente;
        estado.nomeUsuario = oDadosCadastro.nomeUsuario;
        estado.email = oDadosCadastro.email;
        estado.telefone = oDadosCadastro.telefone;
        estado.emCadastro = true;
        
        this.setState(estado);
    }

    render() {
        let dadosCliente = this.state;
        const { navigation } = this.props;        

        if(!dadosCliente.emCadastro) {
            // Obtem os dados vindos da primeira tela.
            dadosCliente.email = navigation.getParam('email', '');
            dadosCliente.cpf = navigation.getParam('cpf', '');
        }

        return (
            <View style={styles.areaCliente}>
                <Cabecalho />
                <AreaDados capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
                <AreaBotoes confirmar={this.confirmar} voltar={this.voltar}/>
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
                <Button title="Confirmar" onPress={this.props.confirmar} color="#4682b4" ></Button>
                <Button title="Voltar" onPress={this.props.voltar} color="#4682b4" ></Button>
            </View>
        );
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