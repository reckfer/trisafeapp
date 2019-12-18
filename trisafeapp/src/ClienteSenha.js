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
            'senhaConfirmacao': ''
        };
        this.limpar = this.limpar.bind(this);
        this.confirmar = this.confirmar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
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

    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteEndereco', this.state);
    }

    confirmar() {
        const { navigation } = this.props;
        
        // if(this.validarDadosPessoais()) {
                        
            navigation.navigate('ClienteConfirmacao', this.state);
        // }
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
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
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
            <View style={styles.areaDadosCliente}>
                <TextInput placeholder="Senha" style={styles.textInput} onChangeText={(valor) => { this.props.dadosCliente.senha = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>                
                <TextInput placeholder="Senha Confirmação" style={styles.textInput} onChangeText={(valor) => { this.props.dadosCliente.senhaConfirmacao = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></TextInput>
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
            <ScrollView>
                <View>
                    <Button title="Confirmar" onPress={this.props.confirmar} color="#4682b4" ></Button>
                    <Button title="Voltar" onPress={this.props.voltar} color="#4682b4" ></Button>
                </View>
            </ScrollView>
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