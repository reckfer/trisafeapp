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
    View
} from 'react-native';
import Util from '../common/Util';
import Cabecalho from '../common/CabecalhoTela';
import AreaBotoes from '../common/AreaBotoes';
import { styles, theme } from '../common/Estilos';
import UtilTests from '../tests/UtilTests';

export default class TestesInicio extends Component {
    static navigationOptions = {
        title: 'TestesInicio'
    }
    constructor(props) {
        super(props);
                        
        this.irParaTesteCadastroIter = this.irParaTesteCadastroIter.bind(this);
        this.irParaTesteBoletoGerenciaNet = this.irParaTesteBoletoGerenciaNet.bind(this);        
        this.irParaTesteContratoPDF = this.irParaTesteContratoPDF.bind(this);
        this.gerarDadosTestes = this.gerarDadosTestes.bind(this);
        this.obterUltimoCliente = this.obterUltimoCliente.bind(this);
        this.tratarDadosRetorno = this.tratarDadosRetorno.bind(this);

        objUtilTests = new UtilTests();
        objUtil = new Util();

        this.state = objUtil.inicializarDados();
        this.obterUltimoCliente();
    }

    irParaTesteCadastroIter() {
        const { navigation } = this.props;
        
        // this.gerarDadosTestes();

        navigation.navigate('ClienteConfirmacao', this.state);
    }

    irParaTesteBoletoGerenciaNet() {
        const { navigation } = this.props;
        // this.gerarDadosTestes();

        navigation.navigate('ProdutoEscolha', this.state);
    }

    irParaTesteContratoPDF() {
        const { navigation } = this.props;
        
        navigation.navigate('ContratoEfetivacao');
    }

    obterUltimoCliente() {
        try {
            let url = objUtil.getURL('/clientes/obter_ultimo/');
           
            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: {}
                  })
                  .then(objUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      objUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosRetorno);
                  })
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    tratarDadosRetorno(oDados) {
        let estado = this.state;

        estado.processandoRequisicao = false;
        this.setState(estado);

        if(oDados) {
            estado.cliente.nome = oDados.nome;
            estado.cliente.cpf = oDados.cpf;
            estado.cliente.email = oDados.email;
            estado.cliente.nomeUsuario = oDados.usuario;
            estado.cliente.telefone = oDados.email;
            estado.cliente.rua = oDados.rua;

            this.setState(estado);
        }
    }

    gerarDadosTestes() {
        let numAleatorio = Math.random();
        let usuario = numAleatorio.toString(36).slice(6);        
        let oEstado = this.state;

        oEstado.cliente.nome = 'Fernando Reck ' + usuario;
        oEstado.cliente.cpf = objUtilTests.gerarCPF();
        oEstado.cliente.email = usuario + '@emailtestes.com.br';
        oEstado.cliente.nomeUsuario = usuario;
        oEstado.cliente.telefone = '51' + numAleatorio.toString().slice(9);
        oEstado.cliente.rua = 'Rua do Relógio';
        oEstado.cliente.numero = numAleatorio.toString().slice(15);
        oEstado.cliente.cidade = 'Porto Alegre';
        oEstado.cliente.uf = 'RS';
        oEstado.cliente.complemento = 'Ap. 4' + numAleatorio.toString(16);
        oEstado.cliente.bairro = 'Bela Vista';
        oEstado.cliente.cep = numAleatorio.toString().slice(10);
        oEstado.contrato.valorTotal = Math.floor(Math.random() * 100) + 1;
        oEstado.contrato.listaProdutos = [1, 2, 3];
        oEstado.contrato.boleto.url_boleto_pdf = '';
        oEstado.contrato.boleto.url_boleto_html = '';
        oEstado.emTestes = true;

        this.setState(oEstado);
    }

    botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>;
    
    render() {
        let botoesTela = [ 
            { element: this.botaoVoltar }, 
        ];
        let funcoes = {
            'irParaTesteCadastroIter': this.irParaTesteCadastroIter,
            'irParaTesteBoletoGerenciaNet': this.irParaTesteBoletoGerenciaNet,
            'irParaTesteContratoPDF': this.irParaTesteContratoPDF,
            'gerarDadosTestes': this.gerarDadosTestes,
        }
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Testes' nomeTela='Início' />
                <AreaGrid funcoes={funcoes} estado={this.state} />
                <AreaBotoes botoes={botoesTela} />
            </View>
        );
    }
}

export class AreaGrid extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let estado = this.props.estado;
        let cliente = this.props.estado.cliente;
        return (
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'column', }}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{height:50}} >
                            <Button title="Cadastro Iter" onPress={this.props.funcoes.irParaTesteCadastroIter} ></Button>
                        </View>
                        <View style={{height:50}} >
                            <Button title="Contrato PDF" onPress={this.props.funcoes.irParaTesteContratoPDF}></Button>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{height:50}} >
                            <Button title="Boleto GerenciaNet" onPress={this.props.funcoes.irParaTesteBoletoGerenciaNet} ></Button>
                        </View>
                        <View style={{height:50}} >
                            <Button title="Menu" ></Button>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{height:50}} >
                            <Button title="Gerar CPF" onPress={this.props.funcoes.gerarDadosTestes} ></Button>
                        </View>                        
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
                            <Input label="Nome Completo" style={styles.Input} value={cliente.nome} onChangeText={(valor) => { estado.cliente.nome = valor; this.setState(estado) }}></Input>                
                            <Input label="E-mail" style={styles.Input} value={cliente.email} onChangeText={(valor) => { estado.cliente.email = valor; this.setState(estado) }}></Input>
                            <Input label="CPF" style={styles.Input} value={cliente.cpf} onChangeText={(valor) => { estado.cliente.cpf = valor; this.setState(estado)}}></Input>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}