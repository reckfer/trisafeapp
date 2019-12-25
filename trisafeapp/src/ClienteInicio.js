/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ThemeProvider, Input, Button} from 'react-native-elements';
import {
    ScrollView,
    Alert,
    View,
} from 'react-native';
import Util from './Util';
import Cabecalho from './common/CabecalhoTela';
import AreaBotoes from './common/AreaBotoes';
import { styles, theme } from './common/Estilos';

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
    botaoIniciar = () => <Button title="Iniciar" onPress={this.obterCliente} ></Button>

    render() {
        let dadosCliente = this.state;
        let botoesTela = [ { element: this.botaoIniciar } ];

        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Início' />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
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
                        <Input placeholder="Informe seu E-Mail" label="E-Mail" onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu CPF" label="CPF" onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                    </View>
                </ThemeProvider>
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