/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ThemeProvider, Input, Button } from 'react-native-elements';
import {
    StyleSheet,
    ScrollView,
    Alert,
    View,
    Image,
    Text,
    TextInput,
    // Button
} from 'react-native';
import Util from './Util';

const theme = {
    Input: {
        // labelStyle: {
        //   color: 'red',
        // },
        containerStyle: {
            marginTop: 12,
            backgroundColor: '#fffafa',
            borderRadius: 7,
            alignSelf: 'stretch',
            shadowColor: "#000",

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
        },
        inputContainerStyle: {
            borderWidth: 0,
            borderColor: 'white',
          },
      },
    Button: {
        buttonStyle: {
            width: 10,
        },
    }
  };

export default class ClienteInicio extends Component {
    static navigationOptions = {
        title: 'ClienteInicio'
    }
    constructor(props) {
        super(props);
        this.state = {
            'cpf': '',
            'email': ''
        };
        this.limpar = this.limpar.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        this.obterCliente = this.obterCliente.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
        objUtil = new Util();
    }

    capturarDadosCadastro(oDadosCadastro) {
        let estado = this.state;

        estado.cpf = oDadosCadastro.cpf;
        estado.email = oDadosCadastro.email;

        this.setState(estado);
    }

    obterCliente() {
        try {
            let estado = this.state;
            let url = objUtil.getURL('/clientes/obter/');

            fetch(url, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  cpf: estado.cpf,
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
        let oDadosCliente;

        if(oJsonDados && oJsonDados.dados && oJsonDados.dados.trim()) {

            oDadosCliente = oJsonDados.dados;

        } else {

            if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
                Alert.alert(oJsonDados.mensagem);
            }
            oDadosCliente = this.state;
        }

        navigation.navigate('ClienteDadosPessoais', oDadosCliente);
    }

    limpar() {
        let estado = this.state;

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
                <Titulo titulo='Cadastro' nomeTela='Início' />
            </View>
        );
    }
}

export class Titulo extends Component {
    render() {
        return (
            <View style={styles.areaTitulo}>
                <Text style={styles.textoTitulo}>{this.props.titulo}</Text>
                <Text style={styles.textoNomeTela}>{this.props.nomeTela}</Text>
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
                        <Input placeholder="Informe seu E-Mail" label="E-Mail" onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu CPF" label="CPF" onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>
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
        return (
            <View style={styles.botao}>
                <Button title="Iniciar" type="solid" raised={true} onPress={this.props.obterCliente} ></Button>
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
        // flexDirection: 'column',
        // justifyContent: 'space-around',
        // alignItems: 'stretch'
        // backgroundColor: '#2E9298',
        padding: 10,       
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
        fontSize: 20,
        fontWeight: '200',
        color: '#000000',
        textAlign: 'center',
        
    },
    textoNomeTela: {
        fontSize: 28,
        fontWeight: '300',
        color: '#000000',
        textAlign: 'center',
        marginTop: 10,
    },
    botao: {
        padding: 20,
        // borderColor: '#add8e6',
        // borderWidth: 1,
        // borderRadius: 7,
        // marginTop: 12,
        // backgroundColor: '#fffafa',
        // alignSelf: 'stretch'
    },
    input: {
        borderColor: '#add8e6'
    },
});