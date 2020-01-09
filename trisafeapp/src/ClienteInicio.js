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
import Util from './common/Util';
import Cabecalho from './common/CabecalhoTela';
import AreaBotoes from './common/AreaBotoes';
import { styles, theme } from './common/Estilos';

export default class ClienteInicio extends Component {
    static navigationOptions = {
        title: 'ClienteInicio'
    }
    constructor(props) {
        super(props);
        
        this.limpar = this.limpar.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        this.obterCliente = this.obterCliente.bind(this);
        this.tratarDadosCliente = this.tratarDadosCliente.bind(this);
        objUtil = new Util();

        this.state = objUtil.inicializarDadosCliente();
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

            estado.processandoRequisicao = true;
            this.setState(estado);

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
                .then(objUtil.obterJsonResposta)
                .then((oJsonDados) => {
                    objUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosCliente, true);
                })
                .catch(function (erro) {
                    Alert.alert(erro.message);
                    throw erro;
                });
        } catch (exc) {
            Alert.alert(exc.message);
            throw exc;
        }
    }
    tratarDadosCliente(oDados, oEstado) {
        const { navigation } = this.props;
        let oDadosCliente;

        if(oEstado.cod_mensagem === 'NaoCadastrado') {
            Alert.alert('Seu cadastro não foi localizado. Preencha os dados solicitados para realizá-lo.');
        } else if (oEstado.mensagem && oEstado.mensagem.trim()) {
            Alert.alert(oEstado.mensagem);
        }
        if(oDados) {
            oDadosCliente = oDados;
        } else {
            oDadosCliente = this.state;
        }
        let estado = this.state;
        estado.processandoRequisicao = false;
        this.setState(estado);
        
        oDadosCliente.emCadastro = true;
        navigation.navigate('ClienteDadosPessoais', oDadosCliente);
    }

    limpar() {
        let estado = this.state;

        estado.cpf = '';
        estado.email = '';
        this.setState(estado);
    }
    botaoIniciar = () => <Button title="Iniciar" onPress={this.obterCliente} loading={this.state.processandoRequisicao}></Button>;

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